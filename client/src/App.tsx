import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { getDueDateStatus, formatDueDate, getRelativeTime } from './utils/dateUtils'
import type { DueDateStatus } from './utils/dateUtils'
import './App.css'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
  dueDate?: number
}

type Filter = 'all' | 'active' | 'done'

const STORAGE_KEY = 'postnord-todos-v1'

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  done: 'Done',
}

function readTodosFromStorage(): Todo[] {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored) as Todo[]
    return Array.isArray(parsed)
      ? parsed.map((t) => ({ ...t, dueDate: t.dueDate ?? undefined }))
      : []
  } catch {
    return []
  }
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

function dueDateStatusClass(status: DueDateStatus): string {
  if (status === 'overdue') return ' todo-item--overdue'
  if (status === 'warning') return ' todo-item--due-soon'
  return ''
}

function dueDateBadgeClass(status: DueDateStatus): string {
  if (status === 'overdue') return ' due-badge--overdue'
  if (status === 'warning') return ' due-badge--warning'
  return ''
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(readTodosFromStorage)
  const [draft, setDraft] = useState('')
  const [draftDueDate, setDraftDueDate] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // Re-render every 60 seconds to keep due-date statuses current
  const [, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(interval)
  }, [])

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'done':
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }
  }, [filter, todos])

  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  )

  const completedCount = todos.length - activeCount

  const submitTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const text = draft.trim()
    if (!text) {
      return
    }

    let dueDate: number | undefined
    if (draftDueDate) {
      const timestamp = new Date(draftDueDate).getTime()
      dueDate = Number.isFinite(timestamp) ? timestamp : undefined
    }
    setTodos((current) => [createTodo(text, dueDate), ...current])
    setDraft('')
    setDraftDueDate('')
  }

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed))
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__logo" aria-hidden>
          <span className="hero__dot" />
          <span className="hero__name">POSTNORD TASKS</span>
        </div>
        <h1>Local Todo Manager</h1>
        <p>Simple task tracking in your browser, with no backend setup.</p>
      </header>

      <main className="todo-card">
        <form className="todo-form" onSubmit={submitTodo}>
          <label htmlFor="todo-input" className="sr-only">
            Add a task
          </label>
          <input
            id="todo-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a delivery, follow-up, or reminder"
            maxLength={120}
          />
          <input
            id="todo-due-date"
            type="datetime-local"
            className="todo-form__due-date"
            value={draftDueDate}
            onChange={(event) => setDraftDueDate(event.target.value)}
            aria-label="Due date"
          />
          <button type="submit">Add</button>
        </form>

        <section className="toolbar" aria-label="Todo controls">
          <div className="filters" role="tablist" aria-label="Filter tasks">
            {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                className={filter === key ? 'is-active' : ''}
                onClick={() => setFilter(key)}
                role="tab"
                aria-selected={filter === key}
              >
                {FILTER_LABELS[key]}
              </button>
            ))}
          </div>
          <p className="stats">
            <span>{activeCount} open</span>
            <span>{completedCount} done</span>
          </p>
        </section>

        <ul className="todo-list" aria-live="polite">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">No tasks in this view.</li>
          ) : (
            filteredTodos.map((todo) => {
              const status = getDueDateStatus(todo.dueDate)
              const itemClass =
                (todo.completed ? 'todo-item completed' : 'todo-item') +
                (todo.completed ? '' : dueDateStatusClass(status))

              return (
                <li key={todo.id} className={itemClass}>
                  <label className="todo-item__label">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span>{todo.text}</span>
                  </label>

                  <div className="todo-item__meta">
                    {todo.dueDate && (
                      <span
                        className={`due-badge${dueDateBadgeClass(status)}`}
                        title={getRelativeTime(todo.dueDate)}
                        aria-label={`Due: ${formatDueDate(todo.dueDate)} (${getRelativeTime(todo.dueDate)})`}
                      >
                        {formatDueDate(todo.dueDate)} &middot; {getRelativeTime(todo.dueDate)}
                      </span>
                    )}
                    <button
                      type="button"
                      className="todo-item__delete"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label={`Delete ${todo.text}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })
          )}
        </ul>

        <footer className="card-footer">
          <button
            type="button"
            className="secondary"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear done
          </button>
          <small>Stored locally in this browser</small>
        </footer>
      </main>
    </div>
  )
}

export default App
