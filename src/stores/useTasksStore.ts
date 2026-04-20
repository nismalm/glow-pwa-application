import { create } from 'zustand'
import { format } from 'date-fns'
import { writeTask, toggleTask } from '@/lib/storeSync'
import type { Task } from '@/types/models'

interface TasksState {
  tasks: Task[]
  hydrate: (tasks: Task[]) => void
  addTask: (task: Task) => void
  toggle: (id: string) => void
  tasksForDate: (dateStr: string) => Task[]
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  hydrate: (tasks) => set({ tasks }),
  addTask: (task) => {
    set((s) => ({ tasks: [...s.tasks, task] }))
    const { id, ...data } = task
    writeTask(id, {
      ...data,
      dueAt: task.dueAt,
    })
  },
  toggle: (id) => {
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }))
    const task = get().tasks.find((t) => t.id === id)
    if (task) toggleTask(id, !task.done)
  },
  tasksForDate: (dateStr) =>
    get().tasks.filter((t) => format(t.dueAt, 'yyyy-MM-dd') === dateStr),
}))
