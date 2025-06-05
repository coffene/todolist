import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const EditTodoDialog = ({ open, onClose, todo, onEdit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    deadline: null,
    category_id: '',
    tags: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        status: todo.status || 'pending',
        deadline: todo.deadline ? new Date(todo.deadline) : null,
        category_id: todo.category_id || '',
        tags: todo.tags || [],
      });
    }
    fetchCategories();
  }, [todo]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/categories?user_id=${user._id}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (todo) {
        // Update existing todo
        response = await axios.put(`http://localhost:5000/api/tasks/${todo._id}`, {
          ...formData,
          user_id: user._id,
        });
        if (onEdit) onEdit(response.data);
      } else {
        // Create new todo
        response = await axios.post('http://localhost:5000/api/tasks', {
          ...formData,
          user_id: user._id,
        });
        if (onEdit) onEdit(response.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{todo ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            {todo && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category_id}
                onChange={handleChange('category_id')}
                label="Category"
              >
                <MenuItem value="">None</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Deadline"
                value={formData.deadline}
                onChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    deadline: newValue
                  }));
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {todo ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTodoDialog; 