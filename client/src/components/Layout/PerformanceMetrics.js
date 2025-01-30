import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    usersRegistered: 0,
    activeUsersThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('/api/performance/performance-metrics');
        setMetrics(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
        <div>Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 text-sm">
      <div className="flex flex-col items-center">
        <span className="font-bold text-primary dark:text-primary-900 text-lg">
          {metrics.totalTasks.toLocaleString()}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Total Tasks
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold text-primary dark:text-primary-900 text-lg">
          {metrics.usersRegistered.toLocaleString()}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Users Registered
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold text-primary dark:text-primary-900 text-lg">
          {metrics.activeUsersThisMonth.toLocaleString()}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Active Users
        </span>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
