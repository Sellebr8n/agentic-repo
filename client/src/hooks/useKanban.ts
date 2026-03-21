import { useEffect, useState } from 'react'

export interface KanbanTodo {
  id: string
  title: string
  description?: string
  column: 'todo' | 'in_progress' | 'done'
  createdAt: string
}

const STORAGE_KEY = 'kanban_todos'

function readTodosFromStorage(): KanbanTodo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useKanban() {
  const [todos, setTodos] = useState<KanbanTodo[]>(readTodosFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (title: string, description?: string) => {
    const newTodo: KanbanTodo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      column: 'todo',
      createdAt: new Date().toISOString(),
    }
    setTodos((current) => [newTodo, ...current])
  }

  const moveTodo = (id: string, column: KanbanTodo['column']) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, column } : todo,
      ),
    )
  }

  const updateTodo = (id: string, title: string, description?: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? { ...todo, title: title.trim(), description: description?.trim() }
          : todo,
      ),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  return {
    todos,
    addTodo,
    moveTodo,
    updateTodo,
    deleteTodo,
  }
}
