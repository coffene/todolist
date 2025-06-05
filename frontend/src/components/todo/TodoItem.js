import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Chip,
  Box,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import EditTodoDialog from './EditTodoDialog';

const TodoItem = ({ todo, onStatusChange, onDelete, categories }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(todo._id);
    handleMenuClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getCategoryName = (catId) => {
    if (!catId || !categories) return '';
    const cat = categories.find(c => c._id === catId);
    return cat ? cat.name : '';
  };

  return (
    <>
      <ListItem
        sx={{
          bgcolor: 'background.paper',
          mb: 1,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Checkbox
          edge="start"
          checked={todo.status === 'completed'}
          onChange={() => onStatusChange(todo._id, todo.status === 'completed' ? 'pending' : 'completed')}
        />
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                color: todo.status === 'completed' ? 'text.secondary' : 'text.primary',
              }}
            >
              {todo.title}
            </Typography>
          }
          secondary={
            <Box sx={{ mt: 1 }}>
              {todo.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {todo.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  label={todo.status}
                  color={getStatusColor(todo.status)}
                />
                <Chip
                  size="small"
                  label={todo.priority}
                  color={getPriorityColor(todo.priority)}
                />
                {todo.deadline && (
                  <Chip
                    size="small"
                    label={format(new Date(todo.deadline), 'MMM d, yyyy')}
                    color={new Date(todo.deadline) < new Date() ? 'error' : 'default'}
                  />
                )}
                {todo.category_id && (
                  <Chip
                    size="small"
                    label={getCategoryName(todo.category_id)}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          }
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <EditTodoDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        todo={todo}
      />
    </>
  );
};

export default TodoItem; 