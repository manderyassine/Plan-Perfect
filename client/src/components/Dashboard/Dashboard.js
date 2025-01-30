import React, { useState, useEffect } from 'react';
import Card from '../Card';
import DateTimeWeather from '../Common/DateTimeWeather';
import { tasks } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // Generate personalized greeting
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };

    setGreeting(getGreeting());
  }, []);

  const fetchTaskStats = async () => {
    try {
      setLoading(true);
      const tasksResponse = await tasks.getAll();

      const allTasks = tasksResponse.data;

      // Validate tasks data
      if (!Array.isArray(allTasks)) {
        throw new Error('Invalid tasks data received');
      }

      const completedTasks = allTasks.filter(task => task.status === 'completed').length;
      const pendingTasks = allTasks.filter(task => task.status === 'pending').length;
      const inProgressTasks = allTasks.filter(task => task.status === 'in-progress').length;

      // Sort tasks by most recent first
      const sortedTasks = allTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTaskStats({
        totalTasks: allTasks.length,
        completedTasks,
        pendingTasks,
        inProgressTasks,
      });

      // Take top 5 most recent tasks
      setRecentTasks(sortedTasks.slice(0, 5));
    } catch (error) {
      console.error('Error fetching task stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskStats();
  }, []);

  // Determine display name
  const displayName = user?.name || user?.username || 'User';

  // Prepare user location for weather component
  const userLocation = user?.location ? {
    city: user.location.city || user.location.name || 'New York',
    country: user.location.country
  } : null;

  // Debug logging
  React.useEffect(() => {
    console.log('Dashboard User Location Debug:', {
      user,
      userLocation,
      locationCity: user?.location?.city,
      locationType: typeof user?.location
    });
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200'
      };
      case 'in-progress': return {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-200'
      };
      case 'pending': return {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-200'
      };
      default: return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-200'
      };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {greeting}, {displayName}
          </h1>
        </div>
        <DateTimeWeather userLocation={userLocation} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <h3 className="text-2xl font-bold text-text dark:text-white mb-2">
            {taskStats.totalTasks.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Tasks</p>
        </Card>
        <Card className="p-6 text-center">
          <h3 className="text-2xl font-bold text-text dark:text-white mb-2">
            {taskStats.completedTasks.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Completed Tasks</p>
        </Card>
        <Card className="p-6 text-center">
          <h3 className="text-2xl font-bold text-text dark:text-white mb-2">
            {taskStats.pendingTasks.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Pending Tasks</p>
        </Card>
        <Card className="p-6 text-center">
          <h3 className="text-2xl font-bold text-text dark:text-white mb-2">
            {taskStats.inProgressTasks.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">In Progress Tasks</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text dark:text-white">Recent Tasks</h2>
            <Link 
              to="/tasks" 
              className="text-primary hover:underline dark:text-primary-light"
            >
              View All Tasks
            </Link>
          </div>
          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Loading tasks...</p>
          ) : recentTasks.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">No tasks found</p>
          ) : (
            <div className="space-y-4">
              {recentTasks.map(task => {
                const statusColors = getStatusColor(task.status);
                return (
                  <div 
                    key={task._id} 
                    className={`flex justify-between items-center p-4 ${statusColors.bg} rounded-lg`}
                  >
                    <div>
                      <h3 className="font-semibold text-text dark:text-white">{task.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                    </div>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs uppercase ${statusColors.text}`}
                    >
                      {task.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-text dark:text-white mb-4">Task Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completed Tasks</span>
              <div className="flex items-center">
                <span className="font-bold mr-2 text-green-600 dark:text-green-400">
                  {taskStats.completedTasks}
                </span>
                <div 
                  className="h-2 bg-green-200 dark:bg-green-800 rounded-full w-32"
                  style={{
                    width: `${(taskStats.completedTasks / Math.max(taskStats.totalTasks, 1)) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending Tasks</span>
              <div className="flex items-center">
                <span className="font-bold mr-2 text-red-600 dark:text-red-400">
                  {taskStats.pendingTasks}
                </span>
                <div 
                  className="h-2 bg-red-200 dark:bg-red-800 rounded-full w-32"
                  style={{
                    width: `${(taskStats.pendingTasks / Math.max(taskStats.totalTasks, 1)) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">In Progress Tasks</span>
              <div className="flex items-center">
                <span className="font-bold mr-2 text-yellow-600 dark:text-yellow-400">
                  {taskStats.inProgressTasks}
                </span>
                <div 
                  className="h-2 bg-yellow-200 dark:bg-yellow-800 rounded-full w-32"
                  style={{
                    width: `${(taskStats.inProgressTasks / Math.max(taskStats.totalTasks, 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
