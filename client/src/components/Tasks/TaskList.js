import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import { tasks } from '../../services/api';

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...task,
      title,
      description,
      priority,
      status
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="textarea"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-2">
              {['low', 'medium', 'high'].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={priority === level ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPriority(level)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-4 flex items-center justify-between">
      <div className="flex-grow">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-text">{task.title}</h3>
          <span 
            className={`px-2 py-1 rounded-full text-xs uppercase ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="text-gray-600 mt-2">{task.description}</p>
        )}
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUpdate(task)}
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500 border-red-500 hover:bg-red-50"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

const TaskList = () => {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasks.getAll();
      setTaskList(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasks.delete(taskId);
      setTaskList(taskList.filter(task => task._id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await tasks.update(updatedTask._id, updatedTask);
      setTaskList(taskList.map(task => 
        task._id === updatedTask._id ? response.data : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredAndSortedTasks = taskList
    .filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline || 0) - new Date(b.deadline || 0);
      }
      return a.title.localeCompare(b.title);
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border border-red-200 text-red-800 p-4">
        {error}
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {editingTask && (
        <EditTaskModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}
      <h2 className="text-2xl font-bold mb-6 text-text">Your Tasks</h2>
      <div className="flex justify-between mb-4">
        <input 
          type="search" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search tasks" 
          className="py-2 pl-10 text-sm text-gray-700"
        />
        <div className="flex space-x-2">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="py-2 pl-10 text-sm text-gray-700"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="py-2 pl-10 text-sm text-gray-700"
          >
            <option value="deadline">Deadline</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      {taskList.length === 0 ? (
        <Card className="text-center text-gray-600 p-6">
          No tasks found. Create a new task to get started!
        </Card>
      ) : (
        filteredAndSortedTasks.map(task => (
          <TaskItem 
            key={task._id} 
            task={task} 
            onDelete={handleDeleteTask}
            onUpdate={() => setEditingTask(task)}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
