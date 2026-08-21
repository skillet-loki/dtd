import { useState } from 'react';
import TaskForm from './TaskForm';
import './TaskItem.css';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function isOverdue(dateStr, completed) {
  if (!dateStr || completed) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export default function TaskItem({ task, category, onUpdate, onDelete, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave(form) {
    onUpdate(category, task.id, form);
    setEditing(false);
  }

  const overdue = isOverdue(task.dueDate, task.completed);

  if (editing) {
    return (
      <li className="task-item task-item--editing">
        <TaskForm
          initial={task}
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`task-item${task.completed ? ' task-item--done' : ''}${overdue ? ' task-item--overdue' : ''}`}>
      <div className="task-item__check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(category, task.id)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        />
      </div>

      <div className="task-item__body">
        <div className="task-item__header">
          <span className="task-item__title">{task.title}</span>
          <span className={`badge badge--${task.priority}`}>{task.priority}</span>
        </div>

        {task.description && (
          <p className="task-item__desc">{task.description}</p>
        )}

        {task.dueDate && (
          <span className={`task-item__due${overdue ? ' task-item__due--overdue' : ''}`}>
            {overdue ? '⚠ Overdue · ' : '📅 '}{formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="task-item__actions">
        <button
          className="btn-icon"
          title="Edit"
          onClick={() => setEditing(true)}
          aria-label="Edit task"
        >
          ✏️
        </button>
        {confirmDelete ? (
          <>
            <button
              className="btn-icon btn-icon--danger"
              title="Confirm delete"
              onClick={() => onDelete(category, task.id)}
              aria-label="Confirm delete"
            >
              ✓
            </button>
            <button
              className="btn-icon"
              title="Cancel"
              onClick={() => setConfirmDelete(false)}
              aria-label="Cancel delete"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            className="btn-icon btn-icon--danger"
            title="Delete"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete task"
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
}
