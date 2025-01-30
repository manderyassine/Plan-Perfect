import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';
import { auth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DateTimeWeather from '../Common/DateTimeWeather';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await auth.login({ email, password });
      
      console.log('Login Response:', {
        token: response.data.token ? 'Present' : 'Missing',
        user: response.data.user
      });

      // Combine user data with token
      const userData = {
        ...response.data.user,
        token: response.data.token
      };

      // Use the user from the response
      login(userData);
      
      navigate('/dashboard');  
    } catch (err) {
      console.error('Login Error:', {
        errorResponse: err.response?.data,
        errorMessage: err.message
      });
      
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-6 right-6">
        <DateTimeWeather />
      </div>
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-text">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <Button 
            type="submit" 
            className="w-full"
          >
            Sign In
          </Button>
          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/register')}
              className="mt-2"
            >
              Create an Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
