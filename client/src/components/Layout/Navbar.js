import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { token, user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        <Box display="flex" alignItems="center">
          {token ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/tasks"
              >
                Tasks
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/tasks/create"
              >
                Create Task
              </Button>
              <Tooltip title="Profile">
                <IconButton 
                  component={RouterLink} 
                  to="/profile"
                  sx={{ ml: 1, mr: 1 }}
                >
                  <Avatar 
                    src={user?.profileImage || 'https://ui-avatars.com/api/?name=User&background=random'} 
                    alt={user?.name || 'User Profile'}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
              <Button
                color="inherit"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
