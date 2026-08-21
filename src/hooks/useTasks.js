import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'daily-tasks-dashboard';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { work: [], personal: [] };
  } catch {
    return { work: [], personal: [] };
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(category, task) {
    setTasks(prev => ({
      ...prev,
      [category]: [
        ...prev[category],
        {
          id: uuidv4(),
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate || '',
          priority: task.priority || 'medium',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }

  function updateTask(category, id, updates) {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].map(t => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }

  function deleteTask(category, id) {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].filter(t => t.id !== id),
    }));
  }

  function toggleComplete(category, id) {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  }

  return { tasks, addTask, updateTask, deleteTask, toggleComplete };
}
