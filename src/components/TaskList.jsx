import { useState, useMemo } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './TaskList.css';
import './TaskList.css';

const PRIORITIES = { high: 1, medium: 2, low: 3 };

export default function TaskList({ category, tasks, onAdd, onUpdate, onDelete, onToggle }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | active | done
  const [filterPriority, setFilterPriority] = useState('all'); // all | high | medium | low
  const [sortBy, setSortBy] = useState('created'); // created | dueDate | priority

  function handleAdd(form) {
    onAdd(category, form);
    setShowForm(false);
  }

  const filtered = useMemo(() => {
    let list = [...tasks];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // status filter
    if (filterStatus === 'active') list = list.filter(t => !t.completed);
    if (filterStatus === 'done') list = list.filter(t => t.completed);

    // priority filter
    if (filterPriority !== 'all') list = list.filter(t => t.priority === filterPriority);

    // sort
    list.sort((a, b) => {
      if (sortBy === 'priority') return PRIORITIES[a.priority] - PRIORITIES[b.priority];
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list;
  }, [tasks, search, filterStatus, filterPriority, sortBy]);

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;

  return (
    <div className="task-list">
      {/* Stats bar */}
      <div className="task-list__stats">
        <span>{done}/{total} completed</span>
        {total > 0 && (
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${(done / total) * 100}%` }} />
          </div>
        )}
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
          + Add Task
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="task-list__form-wrapper">
          <TaskForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Filters */}
      <div className="task-list__filters">
        <input
          type="search"
          placeholder="Search tasks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="filter-search"
          aria-label="Search tasks"
        />

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">Any Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          aria-label="Sort by"
        >
          <option value="created">Newest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="task-list__empty">
          {tasks.length === 0
            ? 'No tasks yet. Click "+ Add Task" to get started!'
            : 'No tasks match your filters.'}
        </div>
      ) : (
        <ul className="task-list__items">
          {filtered.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              category={category}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
