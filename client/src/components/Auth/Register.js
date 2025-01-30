import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';
import { auth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DateTimeWeather from '../Common/DateTimeWeather';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await auth.register({ 
        username, 
        email, 
        password, 
        name 
      });
      
      // Decode token to get user info
      const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
      
      login(tokenPayload, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-6 right-6">
        <DateTimeWeather />
      </div>
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-text">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}
          <Input
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
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
            placeholder="Create a strong password"
            required
          />
          <Input
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            required
          />
          <Button 
            type="submit" 
            className="w-full"
          >
            Sign Up
          </Button>
          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="mt-2"
            >
              Already have an account?
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
