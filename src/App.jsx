import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskList from './components/TaskList';
import ClockLogs from './components/ClockLogs';
import './App.css';

const TABS = [
  { key: 'work', label: '💼 Work' },
  { key: 'personal', label: '🏠 Personal' },
  { key: 'clock', label: '⏱ Clock Logs' },
];

function App() {
  const [activeTab, setActiveTab] = useState('work');
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();

  const workCount = tasks.work.filter(t => !t.completed).length;
  const personalCount = tasks.personal.filter(t => !t.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-header__title">
            <span>📋</span> Daily Tasks Dashboard
          </h1>
          <p className="app-header__sub">Stay on top of your work and personal tasks</p>
        </div>
      </header>

      <main className="app-main">
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tab${activeTab === tab.key ? ' tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {(tab.key === 'work' ? workCount : tab.key === 'personal' ? personalCount : 0) > 0 && (
                <span className="tab__badge">
                  {tab.key === 'work' ? workCount : personalCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="tab-panel">
          {activeTab === 'clock' ? (
            <ClockLogs />
          ) : (
            <TaskList
              key={activeTab}
              category={activeTab}
              tasks={tasks[activeTab]}
              onAdd={addTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onToggle={toggleComplete}
            />
          )}
        </div>
      </main>
    </div>
  );

}

export default App;
