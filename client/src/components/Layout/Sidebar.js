import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  PlusIcon, 
  ClipboardListIcon, 
  CogIcon, 
  LogOutIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { 
      icon: HomeIcon, 
      label: 'Dashboard', 
      path: '/' 
    },
    { 
      icon: ClipboardListIcon, 
      label: 'Tasks', 
      path: '/tasks' 
    },
    { 
      icon: PlusIcon, 
      label: 'Create Task', 
      path: '/create-task' 
    },
    { 
      icon: CogIcon, 
      label: 'Profile', 
      path: '/profile' 
    }
  ];

  const NavItem = ({ icon: Icon, label, path }) => {
    const isActive = location.pathname === path;
    return (
      <Link 
        to={path} 
        className={`
          flex items-center 
          p-3 
          rounded-lg 
          transition-all 
          duration-300 
          group
          ${isActive 
            ? 'bg-primary text-white dark:bg-primary-900' 
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-750'
          }
        `}
      >
        <Icon 
          className={`
            w-5 h-5 
            ${isExpanded ? 'mr-3' : ''}
            ${isActive 
              ? 'text-white' 
              : 'text-gray-500 dark:text-gray-400'
            }
          `}
        />
        {isExpanded && (
          <span 
            className={`
              text-sm 
              font-medium 
              ${isActive 
                ? 'text-white' 
                : 'text-gray-700 dark:text-gray-300'
              }
            `}
          >
            {label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div 
      className={`
        fixed 
        left-0 
        top-0 
        h-full 
        bg-white 
        dark:bg-gray-900 
        shadow-md 
        transition-all 
        duration-300 
        z-50
        ${isExpanded ? 'w-64' : 'w-20'}
        p-4
        flex 
        flex-col
      `}
    >
      <div className="flex items-center mb-10">
        <img 
          src="/logo.png" 
          alt="PlanPerfect Logo" 
          className={`
            h-8 
            transition-all 
            duration-300
            ${isExpanded ? 'mr-4' : ''}
          `}
        />
        {isExpanded && (
          <h1 className="text-xl font-bold text-primary dark:text-primary-900">PlanPerfect</h1>
        )}
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <NavItem 
            key={item.path} 
            icon={item.icon} 
            label={item.label} 
            path={item.path} 
          />
        ))}
      </nav>

      <div className="space-y-2 mb-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            self-center 
            w-full
            p-2 
            rounded-lg 
            bg-gray-100 
            hover:bg-gray-200 
            dark:bg-gray-750 
            dark:hover:bg-gray-700
            transition-all 
            duration-300
          "
        >
          {isExpanded ? '←' : '→'}
        </button>

        <button 
          onClick={toggleDarkMode}
          className="
            flex 
            items-center 
            justify-center 
            w-full 
            p-3 
            bg-gray-100 
            text-gray-700 
            rounded-lg 
            hover:bg-gray-200 
            dark:bg-gray-750 
            dark:text-gray-300 
            dark:hover:bg-gray-700
            transition-all 
            duration-300
          "
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5 mr-3" />
          ) : (
            <MoonIcon className="w-5 h-5 mr-3" />
          )}
          {isExpanded && (darkMode ? 'Light Mode' : 'Dark Mode')}
        </button>
      </div>

      <button 
        onClick={logout}
        className="
          flex 
          items-center 
          justify-center 
          w-full 
          p-3 
          bg-red-50 
          text-red-600 
          rounded-lg 
          hover:bg-red-100 
          dark:bg-red-900/20 
          dark:text-red-400 
          dark:hover:bg-red-900/30
          transition-all 
          duration-300
        "
      >
        <LogOutIcon className="w-5 h-5 mr-3" />
        {isExpanded && 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;
