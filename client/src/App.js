import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import TaskList from './components/Tasks/TaskList';
import CreateTask from './components/Tasks/CreateTask';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Settings from './components/Settings/Settings';
import Profile from './components/Profile/Profile';

// Wrapper component to conditionally render Sidebar
const AppLayout = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check user's system preference for dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check if user has previously set a preference
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Set initial dark mode state
    const initialDarkMode = savedDarkMode 
      ? JSON.parse(savedDarkMode) 
      : prefersDarkMode;
    
    setDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    // Apply dark mode class to root element
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Save preference to local storage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // List of routes where Sidebar should not be shown
  const noSidebarRoutes = ['/login', '/register'];

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      {!noSidebarRoutes.includes(location.pathname) && (
        <Sidebar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
      )}
      
      <main className={`flex-grow bg-background-light dark:bg-background-dark transition-colors duration-300 p-6 
        ${!noSidebarRoutes.includes(location.pathname) ? 'ml-20 md:ml-64' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/tasks" 
            element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/create-task" 
            element={
              <PrivateRoute>
                <CreateTask />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode} 
                />
              </PrivateRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      {!noSidebarRoutes.includes(location.pathname) && <Footer />}
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? '#2C3444' : '#FFFFFF',
            color: darkMode ? '#E5E7EB' : '#1F2937',
          }
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
