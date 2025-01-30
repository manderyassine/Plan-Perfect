import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Moon, Sun } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-900 text-text dark:text-gray-100">
      <Sidebar />
      
      <div className="ml-20 md:ml-64 flex-grow p-6 transition-all duration-300">
        <header className="flex justify-end items-center mb-6">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="
              p-2 
              rounded-full 
              bg-gray-100 
              dark:bg-gray-700 
              hover:bg-gray-200 
              dark:hover:bg-gray-600 
              transition-all 
              duration-300
            "
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </header>
        
        <main className="animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
