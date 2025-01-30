import React, { useState } from 'react';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notification, setNotification] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    // Placeholder for save settings logic
    alert('Settings saved (this is a placeholder)');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-text">Account Settings</h1>
      
      <Card className="max-w-md">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications"
              checked={notification}
              onChange={() => setNotification(!notification)}
              className="form-checkbox h-5 w-5 text-primary"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Receive email notifications
            </label>
          </div>
          
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
