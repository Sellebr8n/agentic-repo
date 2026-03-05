import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
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
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function createTodo(text: string): Todo {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(readTodosFromStorage)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

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

    setTodos((current) => [createTodo(text), ...current])
    setDraft('')
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
            filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={todo.completed ? 'todo-item completed' : 'todo-item'}
              >
                <label className="todo-item__label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>
                <button
                  type="button"
                  className="todo-item__delete"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  Remove
                </button>
              </li>
            ))
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
