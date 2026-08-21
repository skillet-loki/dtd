import { useMemo, useState } from 'react';
import { useClockLogs } from '../hooks/useClockLogs';
import './ClockLogs.css';

function formatDateTime(value) {
  return new Date(value).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (!hrs) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export default function ClockLogs() {
  const { clockState, clockIn, clockOut, clearLogs } = useClockLogs();
  const [note, setNote] = useState('');

  const { isClockedIn, lastClockInAt, logs } = clockState;

  const todaySummary = useMemo(() => {
    const today = new Date().toDateString();

    const todayOutLogs = logs.filter(
      log => log.type === 'out' && new Date(log.at).toDateString() === today
    );

    const sessions = todayOutLogs.length;
    const totalMinutes = todayOutLogs.reduce(
      (sum, log) => sum + (log.workedMinutes || 0),
      0
    );

    return { sessions, totalMinutes };
  }, [logs]);

  function handleClockIn() {
    clockIn(note);
    setNote('');
  }

  function handleClockOut() {
    clockOut(note);
    setNote('');
  }

  return (
    <section className="clock-logs">
      <div className="clock-logs__status">
        <div>
          <h2>Clock In / Clock Out</h2>
          <p className="clock-logs__hint">
            Track your day with timestamped logs.
          </p>
        </div>

        <span className={`clock-pill ${isClockedIn ? 'clock-pill--in' : 'clock-pill--out'}`}>
          {isClockedIn ? 'Clocked In' : 'Clocked Out'}
        </span>
      </div>

      {isClockedIn && lastClockInAt && (
        <p className="clock-logs__since">
          Started at {formatDateTime(lastClockInAt)}
        </p>
      )}

      <div className="clock-logs__actions">
        <textarea
          className="clock-logs__note"
          placeholder="Optional note (meeting, travel, break, etc.)"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          maxLength={200}
        />

        <div className="clock-logs__buttons">
          <button
            className="btn btn-primary"
            onClick={handleClockIn}
            disabled={isClockedIn}
          >
            Clock In
          </button>
          <button
            className="btn btn-ghost"
            onClick={handleClockOut}
            disabled={!isClockedIn}
          >
            Clock Out
          </button>
          <button
            className="btn btn-ghost clock-logs__clear"
            onClick={clearLogs}
            disabled={logs.length === 0}
          >
            Clear Logs
          </button>
        </div>
      </div>

      <div className="clock-logs__summary">
        <div className="summary-card">
          <span className="summary-card__label">Today Sessions</span>
          <span className="summary-card__value">{todaySummary.sessions}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Today Total</span>
          <span className="summary-card__value">{formatDuration(todaySummary.totalMinutes)}</span>
        </div>
      </div>

      <div className="clock-logs__history">
        <h3>History</h3>
        {logs.length === 0 ? (
          <p className="clock-logs__empty">No logs yet.</p>
        ) : (
          <ul>
            {logs.map(log => (
              <li key={log.id} className="clock-log-item">
                <div className="clock-log-item__row">
                  <span className={`clock-log-badge clock-log-badge--${log.type}`}>
                    {log.type === 'in' ? 'IN' : 'OUT'}
                  </span>
                  <span className="clock-log-item__time">{formatDateTime(log.at)}</span>
                  {log.type === 'out' && typeof log.workedMinutes === 'number' && (
                    <span className="clock-log-item__duration">
                      {formatDuration(log.workedMinutes)}
                    </span>
                  )}
                </div>
                {log.note && <p className="clock-log-item__note">{log.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
