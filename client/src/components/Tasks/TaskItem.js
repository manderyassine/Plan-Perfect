import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import moment from 'moment';

const TaskItem = ({ task, onDelete, onStatusUpdate }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(task._id, newStatus);
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success.main';
      case 'in-progress':
        return 'warning.main';
      default:
        return 'info.main';
    }
  };

  return (
    <Paper sx={{ mb: 2, p: 1 }}>
      <ListItem
        secondaryAction={
          <Box>
            <IconButton edge="end" onClick={() => onDelete(task._id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton edge="end" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        }
      >
        <ListItemText
          primary={
            <Typography variant="h6" component="div">
              {task.title}
            </Typography>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: getStatusColor(task.status) }}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Due: {moment(task.deadline).format('MMM DD, YYYY')}
                </Typography>
              </Box>
            </Box>
          }
        />
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('pending')}>
          Set as Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('in-progress')}>
          Set as In Progress
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>
          Set as Completed
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default TaskItem;
