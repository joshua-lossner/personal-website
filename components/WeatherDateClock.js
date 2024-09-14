import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const WeatherDateClock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Chicago'
    });
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md overflow-hidden relative">
      {/* Geometric pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-2 text-gray-600 dark:text-gray-300">
        <div className="flex items-center mb-1">
          <FaCalendarAlt className="mr-1 text-blue-500 dark:text-blue-400" size={12} />
          <span className="text-xs font-medium">{formatDate(date)}</span>
        </div>
        <div className="flex items-center mb-1">
          <FaClock className="mr-1 text-blue-500 dark:text-blue-400" size={12} />
          <span className="text-sm font-bold">
            {formatTime(date)} <span className="text-xs font-normal ml-1">CT</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDateClock;