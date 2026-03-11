import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Trash2, Plus, X, Pencil } from 'lucide-react'
import type { FormEvent } from 'react'
import type { KanbanTodo } from '../hooks/useKanban'
import { useKanban } from '../hooks/useKanban'
import '../App.css'

function KanbanPage() {
  const { todos, addTodo, moveTodo, updateTodo, deleteTodo } = useKanban()
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const columns: KanbanTodo['column'][] = ['todo', 'in_progress', 'done']
  const columnLabels = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addTodo(newTitle, newDesc)
    setNewTitle('')
    setNewDesc('')
  }

  const startEdit = (todo: KanbanTodo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
    setEditDesc(todo.description || '')
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      updateTodo(id, editTitle, editDesc)
      setEditingId(null)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  const handleDelete = (todo: KanbanTodo) => {
    if (window.confirm(`Delete "${todo.title}"?`)) {
      deleteTodo(todo.id)
    }
  }

  const renderCard = (todo: KanbanTodo) => (
    <div key={todo.id} className="kanban-card">
      {editingId === todo.id ? (
        <div className="kanban-edit-wrapper">
          <input
            autoFocus
            type="text"
            className="kanban-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, todo.id)}
          />
          {editDesc && (
            <input
              type="text"
              className="kanban-edit-input kanban-edit-input--desc"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, todo.id)}
              placeholder="Description"
            />
          )}
          <div className="kanban-card-actions">
            <button
              type="button"
              onClick={() => {
                updateTodo(todo.id, editTitle, editDesc)
                setEditingId(null)
              }}
              className="button-with-icon"
              aria-label="Save"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="button-with-icon"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="kanban-card-content">
            <h3 className="kanban-card-title" onClick={() => startEdit(todo)}>
              {todo.title}
              <Pencil size={14} className="kanban-edit-icon" />
            </h3>
            {todo.description && (
              <p className="kanban-card-desc">{todo.description}</p>
            )}
          </div>
          <div className="kanban-card-actions">
            {todo.column !== 'todo' && (
              <button
                type="button"
                onClick={() => {
                  const idx = columns.indexOf(todo.column)
                  if (idx > 0) moveTodo(todo.id, columns[idx - 1])
                }}
                aria-label="Move left"
                className="kanban-btn-nav"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            {todo.column !== 'done' && (
              <button
                type="button"
                onClick={() => {
                  const idx = columns.indexOf(todo.column)
                  if (idx < columns.length - 1) moveTodo(todo.id, columns[idx + 1])
                }}
                aria-label="Move right"
                className="kanban-btn-nav"
              >
                <ChevronRight size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDelete(todo)}
              aria-label={`Delete ${todo.title}`}
              className="kanban-btn-delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="kanban-page">
      <header className="kanban-header">
        <Link to="/" className="kanban-back">
          <ChevronLeft size={18} /> Back to Todos
        </Link>
        <h1>Kanban Board</h1>
      </header>

      <div className="kanban-board">
        {columns.map((col) => {
          const colTodos = todos.filter((t) => t.column === col)
          return (
            <div key={col} className="kanban-column">
              <div className="kanban-column-header">
                <h2>{columnLabels[col]}</h2>
                <span className="kanban-badge">{colTodos.length}</span>
              </div>

              {col === 'todo' && (
                <form className="kanban-add-form" onSubmit={handleAddTodo}>
                  <input
                    type="text"
                    placeholder="Add a task..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                  <button type="submit" className="button-with-icon">
                    <Plus size={16} /> Add
                  </button>
                </form>
              )}

              <div className="kanban-cards">
                {colTodos.length === 0 ? (
                  <p className="kanban-empty">No tasks</p>
                ) : (
                  colTodos.map(renderCard)
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KanbanPage
