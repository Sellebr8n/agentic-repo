import { useState, useEffect } from 'react'
import { getDueDateStatus, formatDueDate, getRelativeTime } from './utils/dateUtils'
import type { DueDateStatus } from './utils/dateUtils'
import './App.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  dueDate?: number
}

const STORAGE_KEY = 'postnord-todos-v1'

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function createTodo(text: string, dueDate?: number): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
    ...(dueDate ? { dueDate } : {}),
  }
}

function getDueDateClassName(status: DueDateStatus): string {
  if (status === 'overdue') return 'overdue'
  if (status === 'warning') return 'warning'
  return ''
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [draftText, setDraftText] = useState('')
  const [draftDueDate, setDraftDueDate] = useState('')

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  // Re-render periodically to update relative times and statuses
  const [, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(interval)
  }, [])

  function submitTodo(e: React.FormEvent) {
    e.preventDefault()
    const text = draftText.trim()
    if (!text) return

    let dueDate: number | undefined
    if (draftDueDate) {
      dueDate = new Date(draftDueDate).getTime()
    }

    setTodos((prev) => [...prev, createTodo(text, dueDate)])
    setDraftText('')
    setDraftDueDate('')
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
      </header>

      <form className="todo-form" onSubmit={submitTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          aria-label="New todo text"
        />
        <input
          type="datetime-local"
          className="due-date-input"
          value={draftDueDate}
          onChange={(e) => setDraftDueDate(e.target.value)}
          aria-label="Due date"
        />
        <button type="submit" className="todo-submit" disabled={!draftText.trim()}>
          Add
        </button>
      </form>

      <ul className="todo-list" aria-label="Todo list">
        {todos.map((todo) => {
          const status = getDueDateStatus(todo.dueDate)
          const statusClass = getDueDateClassName(status)

          return (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${statusClass}`}
            >
              <label className="todo-label">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                />
                <span className="todo-text">{todo.text}</span>
              </label>

              {todo.dueDate && (
                <span
                  className={`due-date-badge ${statusClass}`}
                  title={getRelativeTime(todo.dueDate)}
                  aria-label={`Due: ${formatDueDate(todo.dueDate)} (${getRelativeTime(todo.dueDate)})`}
                >
                  {formatDueDate(todo.dueDate)} &middot; {getRelativeTime(todo.dueDate)}
                </span>
              )}

              <button
                className="todo-delete"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.text}"`}
              >
                &times;
              </button>
            </li>
          )
        })}
      </ul>

      {todos.length === 0 && (
        <p className="empty-state">No todos yet. Add one above!</p>
      )}
    </div>
  )
}

export default App
