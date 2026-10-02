import React, { useState, useEffect } from 'react';

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="safe-top px-7 pt-2 flex items-center justify-between text-xs font-semibold text-slate-200 select-none z-30" data-purpose="status-bar">
      <span>{currentTime}</span>
      <div className="flex items-center space-x-2 text-slate-300">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
        </svg>
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path clipRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zm-2.829 2.828a3 3 0 00-4.242 0 1 1 0 01-1.415-1.414 5 5 0 017.072 0 1 1 0 01-1.415 1.414zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" fillRule="evenodd"></path>
        </svg>
        <div className="flex items-center">
          <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
            <div className="h-full w-full bg-current rounded-[1px]"></div>
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-sm -ml-[0.5px]"></div>
        </div>
      </div>
    </header>
  );
}
