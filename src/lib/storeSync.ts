import type { DailyLog } from '@/types/models'

type WriteDaily = ((partial: Partial<DailyLog>) => void) | null
type GoalHitFn = (() => void) | null
type WriteTask = ((taskId: string, data: object) => void) | null
type ToggleTask = ((taskId: string, done: boolean) => void) | null
type WriteWeight = ((date: string, kg: number) => void) | null

let _writeDaily: WriteDaily = null
let _onGoalHit: GoalHitFn = null
let _writeTask: WriteTask = null
let _toggleTask: ToggleTask = null
let _writeWeight: WriteWeight = null

let _dailyTimer: ReturnType<typeof setTimeout> | null = null
let _pendingDaily: Partial<DailyLog> = {}

export function setWriteDaily(fn: WriteDaily) {
  _writeDaily = fn
  // Cancel any queued write when the bridge is removed (e.g. on logout)
  if (!fn && _dailyTimer) {
    clearTimeout(_dailyTimer)
    _dailyTimer = null
    _pendingDaily = {}
  }
}

export function writeDaily(partial: Partial<DailyLog>) {
  Object.assign(_pendingDaily, partial)
  if (_dailyTimer) clearTimeout(_dailyTimer)
  _dailyTimer = setTimeout(() => {
    _writeDaily?.(_pendingDaily)
    _pendingDaily = {}
    _dailyTimer = null
  }, 500)
}

export function setOnGoalHit(fn: GoalHitFn) {
  _onGoalHit = fn
}

export function notifyGoalHit() {
  _onGoalHit?.()
}

export function setWriteTask(fn: WriteTask) {
  _writeTask = fn
}

export function writeTask(taskId: string, data: object) {
  _writeTask?.(taskId, data)
}

export function setToggleTask(fn: ToggleTask) {
  _toggleTask = fn
}

export function toggleTask(taskId: string, done: boolean) {
  _toggleTask?.(taskId, done)
}

export function setWriteWeight(fn: WriteWeight) {
  _writeWeight = fn
}

export function writeWeight(date: string, kg: number) {
  _writeWeight?.(date, kg)
}
