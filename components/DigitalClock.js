import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Chicago'
    });
  };

  return (
    <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
      {formatTime(time)} <span className="text-sm font-normal">CT</span>
    </div>
  );
};

export default DigitalClock;