import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Plus, Trash2, ListTodo, Circle, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import './App.css'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
  dueDate: string | null
}

type Filter = 'all' | 'active' | 'done'

type DueDateStatus = 'overdue' | 'due-soon' | 'default'

const STORAGE_KEY = 'postnord-todos-v1'

const WARNING_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24 hours

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  done: 'Done',
}

function getDueDateStatus(dueDate: string | null | undefined): DueDateStatus {
  if (!dueDate) return 'default'

  const now = Date.now()
  const due = new Date(dueDate).getTime()

  if (isNaN(due)) return 'default'
  if (due <= now) return 'overdue'
  if (due - now <= WARNING_THRESHOLD_MS) return 'due-soon'

  return 'default'
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function readTodosFromStorage(): Todo[] {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored) as Todo[]
    return Array.isArray(parsed)
      ? parsed.map((t) => ({ ...t, dueDate: t.dueDate ?? null }))
      : []
  } catch {
    return []
  }
}

function createTodo(text: string, dueDate: string | null): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
    dueDate,
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(readTodosFromStorage)
  const [draft, setDraft] = useState('')
  const [draftDueDate, setDraftDueDate] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // Re-render every minute to update due date statuses
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

    const dueDate = draftDueDate ? draftDueDate : null
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

  const FILTER_ICONS: Record<Filter, ReactNode> = {
    all: <ListTodo size={16} />,
    active: <Circle size={16} />,
    done: <CheckCircle size={16} />,
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
            value={draftDueDate}
            onChange={(event) => setDraftDueDate(event.target.value)}
            aria-label="Due date"
            className="todo-form__due-date"
          />
          <button type="submit" className="button-with-icon">
            <Plus size={18} />
            Add
          </button>
        </form>

        <section className="toolbar" aria-label="Todo controls">
          <div className="filters" role="tablist" aria-label="Filter tasks">
            {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                className={['button-with-icon', 'filter-button', filter === key && 'is-active'].filter(Boolean).join(' ')}
                onClick={() => setFilter(key)}
                role="tab"
                aria-selected={filter === key}
              >
                {FILTER_ICONS[key]}
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
              const statusClass =
                status === 'overdue'
                  ? ' todo-item--overdue'
                  : status === 'due-soon'
                    ? ' todo-item--due-soon'
                    : ''

              return (
                <li
                  key={todo.id}
                  className={
                    (todo.completed ? 'todo-item completed' : 'todo-item') +
                    statusClass
                  }
                >
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
                        className={`todo-item__due-date todo-item__due-date--${status}`}
                      >
                        {status === 'overdue' && <AlertCircle size={16} className="inline" />}
                        {status === 'due-soon' && <Clock size={16} className="inline" />}
                        Due: {formatDueDate(todo.dueDate)}
                      </span>
                    )}
                    <button
                      type="button"
                      className="todo-item__delete button-with-icon"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label={`Delete ${todo.text}`}
                    >
                      <Trash2 size={16} />
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
            className="secondary secondary--destructive button-with-icon"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            <Trash2 size={18} />
            Clear All
          </button>
          <small>Stored locally in this browser</small>
        </footer>
      </main>
    </div>
  )
}

export default App
