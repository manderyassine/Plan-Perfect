import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';
import { tasks } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setError('');
    
    // Validate inputs
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      if (!user) {
        setError('Please log in to create a task');
        navigate('/login');
        return;
      }
      
      // Create task
      const response = await tasks.create({ 
        title: title.trim(), 
        description: description.trim(), 
        priority,
        status: 'pending' // Default status
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      
      // Navigate to tasks or show success message
      navigate('/tasks');
    } catch (err) {
      // Detailed error handling
      console.error('Full Error Object:', err);
      
      // Check for specific error types
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorDetails = err.response.data;
        
        // Handle authentication errors
        if (err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          navigate('/login');
          return;
        }

        if (errorDetails.errors) {
          // Validation errors from express-validator
          const validationErrors = errorDetails.errors
            .map(error => error.msg)
            .join(', ');
          setError(validationErrors);
        } else {
          // Server returned an error message
          setError(
            errorDetails.message || 
            'Failed to create task. Please check your input.'
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        setError('Error creating task. Please try again.');
      }
      
      console.error('Task creation error details:', err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <Card className="w-full">
        <h2 className="text-xl font-bold mb-6 text-text">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}
          <Input
            type="text"
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            maxLength={100}
          />
          <Input
            type="textarea"
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add task details"
            className="h-24"
            maxLength={500}
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
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Task...' : 'Create Task'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateTask;
