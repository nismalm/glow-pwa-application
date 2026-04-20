import { create } from 'zustand'
import { format } from 'date-fns'
import type { Task } from '@/types/models'

// Phase 6: swap mockTasks with Firestore users/{uid}/tasks collection
interface TasksState {
  tasks: Task[]
  addTask: (task: Task) => void
  toggle: (id: string) => void
  tasksForDate: (dateStr: string) => Task[]
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  toggle: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  tasksForDate: (dateStr) =>
    get().tasks.filter((t) => format(t.dueAt, 'yyyy-MM-dd') === dateStr),
}))
