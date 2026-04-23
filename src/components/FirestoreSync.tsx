import { useEffect, useState, useCallback } from 'react'
import {
  doc,
  collection,
  query,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
  runTransaction,
  arrayUnion,
} from 'firebase/firestore'
import { format, subDays } from 'date-fns'
import { db } from '@/lib/firebase'
import { todayKey } from '@/lib/dates'
import { setWriteDaily, setOnGoalHit, setWriteTask, setToggleTask, setWriteWeight } from '@/lib/storeSync'
import { getFCMToken } from '@/lib/notifications'
import { useAuthStore } from '@/stores/useAuthStore'
import { useWaterStore } from '@/stores/useWaterStore'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { useRitualsStore } from '@/stores/useRitualsStore'
import { useMoodStore } from '@/stores/useMoodStore'
import { useStreakStore } from '@/stores/useStreakStore'
import { useTasksStore } from '@/stores/useTasksStore'
import { useWeightStore } from '@/stores/useWeightStore'
import { DEFAULT_RITUALS } from '@/types/models'
import type { DailyLog, Streak, Task, WeightEntry } from '@/types/models'

export default function FirestoreSync() {
  const user = useAuthStore((s) => s.user)
  const clientId = useAuthStore((s) => s.clientId)
  const displayName = useAuthStore((s) => s.displayName)

  // today as state so it updates at midnight without a page reload (Bug 8)
  const [today, setToday] = useState(todayKey())
  useEffect(() => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setHours(24, 0, 0, 0)
    const timer = setTimeout(() => setToday(todayKey()), tomorrow.getTime() - now.getTime())
    return () => clearTimeout(timer)
  }, [today])

  // listenerKey increments on any listener error, causing all effects to re-subscribe (Bug 3)
  const [listenerKey, setListenerKey] = useState(0)
  const onErr = useCallback((e: Error) => {
    console.warn('Firestore listener error — re-subscribing in 3s:', e.message)
    setTimeout(() => setListenerKey((k) => k + 1), 3000)
  }, [])

  // Ensure client profile exists; read joinedDate for weight tracking
  useEffect(() => {
    if (!user || !clientId) return
    const profileRef = doc(db, 'users', clientId)
    const joinedDate = todayKey()
    getDoc(profileRef)
      .then((snap) => {
        if (!snap.exists()) {
          setDoc(profileRef, {
            displayName,
            mobile: clientId,
            createdAt: serverTimestamp(),
            joinedDate,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            waterGoal: 12,
            preferences: { reminders: false, theme: 'light' },
          }).catch(console.error)
          useWeightStore.getState().setJoinedDate(joinedDate)
        } else {
          const data = snap.data()
          const stored = (data['joinedDate'] as string | undefined) ?? joinedDate
          useWeightStore.getState().setJoinedDate(stored)
          if (!data['joinedDate']) {
            setDoc(profileRef, { joinedDate }, { merge: true }).catch(console.error)
          }
        }
      })
      .catch(console.error)
  }, [user, clientId, displayName])

  // Register FCM token if permission already granted (silent — no prompt here)
  useEffect(() => {
    if (!user || !clientId) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    getFCMToken().then((token) => {
      if (!token) return
      const profileRef = doc(db, 'users', clientId)
      setDoc(profileRef, { fcmTokens: arrayUnion(token) }, { merge: true }).catch(console.error)
    })
  }, [user, clientId])

  // Subscribe to today's daily log → hydrate stores
  useEffect(() => {
    if (!user || !clientId) return
    const ref = doc(db, 'users', clientId, 'dailyLogs', today)
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) return
      const log = snap.data() as DailyLog
      useWaterStore.getState().hydrate({
        glasses: log.water?.glasses ?? 0,
        goal: log.water?.goal ?? 12,
      })
      useExerciseStore.getState().hydrate(log.exercise ?? null)
      useRitualsStore.getState().hydrate(today, log.rituals ?? DEFAULT_RITUALS)
      useMoodStore.getState().hydrate(log.mood ?? null)
    }, onErr)
  }, [user, clientId, today, listenerKey])

  // Subscribe to streak document → hydrate streak store
  useEffect(() => {
    if (!user || !clientId) return
    const ref = doc(db, 'users', clientId, 'streaks', 'current')
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        useStreakStore.getState().hydrate(snap.data() as Streak)
      }
    }, onErr)
  }, [user, clientId, listenerKey])

  // Subscribe to tasks collection → hydrate tasks store
  useEffect(() => {
    if (!user || !clientId) return
    const q = query(collection(db, 'users', clientId, 'tasks'))
    return onSnapshot(q, (snap) => {
      const tasks: Task[] = snap.docs.map((d) => {
        const data = d.data()
        return {
          ...data,
          id: d.id,
          dueAt: (data['dueAt'] as { toDate?: () => Date } | undefined)?.toDate?.() ?? new Date(),
        } as Task
      })
      useTasksStore.getState().hydrate(tasks)
    }, onErr)
  }, [user, clientId, listenerKey])

  // Subscribe to weights collection → hydrate weight store.
  // No server-side orderBy: Firestore silently excludes docs missing the ordered field,
  // and any query error permanently kills the listener. Sort client-side instead.
  // Coerce kg to number so manually-inserted string values still appear (Bug 4/5).
  useEffect(() => {
    if (!user || !clientId) return
    return onSnapshot(collection(db, 'users', clientId, 'weights'), (snap) => {
      const entries: WeightEntry[] = snap.docs
        .map((d) => {
          const data = d.data()
          return {
            date: data['date'] as string,
            kg: Number(data['kg']),
          }
        })
        .filter((e) => typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && !isNaN(e.kg))
        .sort((a, b) => a.date.localeCompare(b.date))
      useWeightStore.getState().hydrateEntries(entries)
    }, onErr)
  }, [user, clientId, listenerKey])

  // Wire daily log write bridge
  useEffect(() => {
    if (!user || !clientId) return
    setWriteDaily(async (partial) => {
      const ref = doc(db, 'users', clientId, 'dailyLogs', today)
      await setDoc(
        ref,
        { ...partial, date: today, updatedAt: serverTimestamp() },
        { merge: true },
      )
    })
    return () => setWriteDaily(null)
  }, [user, clientId, today])

  // Wire streak transaction (runs when water goal is hit)
  useEffect(() => {
    if (!user || !clientId) return
    setOnGoalHit(async () => {
      const streakRef = doc(db, 'users', clientId, 'streaks', 'current')
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(streakRef)
        const existing: Streak = snap.exists()
          ? (snap.data() as Streak)
          : { count: 0, best: 0, lastCompletedDate: '' }

        if (existing.lastCompletedDate === today) return

        const newCount =
          existing.lastCompletedDate === yesterday ? existing.count + 1 : 1

        tx.set(streakRef, {
          count: newCount,
          best: Math.max(existing.best, newCount),
          lastCompletedDate: today,
        })
      })
    })
    return () => setOnGoalHit(null)
  }, [user, clientId, today])

  // Wire task write bridges
  useEffect(() => {
    if (!user || !clientId) return
    setWriteTask(async (taskId, data) => {
      const ref = doc(db, 'users', clientId, 'tasks', taskId)
      await setDoc(ref, data, { merge: true })
    })
    setToggleTask(async (taskId, done) => {
      const ref = doc(db, 'users', clientId, 'tasks', taskId)
      await setDoc(ref, { done }, { merge: true })
    })
    return () => {
      setWriteTask(null)
      setToggleTask(null)
    }
  }, [user, clientId])

  // Wire weight write bridge — merge: true preserves any future fields,
  // serverTimestamp provides a tiebreaker between concurrent device writes (Bug 7)
  useEffect(() => {
    if (!user || !clientId) return
    setWriteWeight(async (date, kg) => {
      const ref = doc(db, 'users', clientId, 'weights', date)
      await setDoc(ref, { date, kg, updatedAt: serverTimestamp() }, { merge: true })
    })
    return () => setWriteWeight(null)
  }, [user, clientId])

  return null
}
