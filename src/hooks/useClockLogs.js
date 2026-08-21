import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'daily-tasks-clock-logs';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        isClockedIn: false,
        lastClockInAt: '',
        logs: [],
      };
    }

    const parsed = JSON.parse(raw);
    return {
      isClockedIn: Boolean(parsed.isClockedIn),
      lastClockInAt: parsed.lastClockInAt || '',
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
    };
  } catch {
    return {
      isClockedIn: false,
      lastClockInAt: '',
      logs: [],
    };
  }
}

export function useClockLogs() {
  const [clockState, setClockState] = useState(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clockState));
  }, [clockState]);

  function clockIn(note = '') {
    const at = new Date().toISOString();

    setClockState(prev => {
      if (prev.isClockedIn) return prev;

      return {
        ...prev,
        isClockedIn: true,
        lastClockInAt: at,
        logs: [
          {
            id: uuidv4(),
            type: 'in',
            at,
            note: note.trim(),
          },
          ...prev.logs,
        ],
      };
    });
  }

  function clockOut(note = '') {
    const at = new Date().toISOString();

    setClockState(prev => {
      if (!prev.isClockedIn || !prev.lastClockInAt) return prev;

      const start = new Date(prev.lastClockInAt);
      const end = new Date(at);
      const workedMinutes = Math.max(0, Math.round((end - start) / 60000));

      return {
        ...prev,
        isClockedIn: false,
        lastClockInAt: '',
        logs: [
          {
            id: uuidv4(),
            type: 'out',
            at,
            note: note.trim(),
            workedMinutes,
          },
          ...prev.logs,
        ],
      };
    });
  }

  function clearLogs() {
    setClockState({
      isClockedIn: false,
      lastClockInAt: '',
      logs: [],
    });
  }

  return {
    clockState,
    clockIn,
    clockOut,
    clearLogs,
  };
}
