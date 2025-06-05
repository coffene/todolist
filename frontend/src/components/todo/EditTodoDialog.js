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
  Typography,
  CircularProgress,
} from '@mui/material';

const EditTodoDialog = ({ open, onClose, onEdit, todo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    deadline: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        category: todo.category || '',
        deadline: todo.deadline
          ? (() => {
              const d = new Date(todo.deadline);
              // Format yyyy-MM-ddTHH:mm
              const pad = n => n.toString().padStart(2, '0');
              return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
            })()
          : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        deadline: '',
      });
    }
    fetchCategories();
  }, [todo]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = todo
        ? `http://localhost:5000/api/tasks/${todo._id}`
        : 'http://localhost:5000/api/tasks';
      
      const response = await fetch(url, {
        method: todo ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: formData.description || '',
        }),
      });

      if (!response.ok) throw new Error('Failed to save task');

      const savedTask = await response.json();
      onEdit(savedTask);
      onClose();
    } catch (err) {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {todo ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              renderValue={selected => {
                const cat = categories.find(c => c._id === selected);
                if (!cat) return <em>None</em>;
                return (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {cat.icon && (/^https?:\/\//.test(cat.icon)
                      ? <img src={cat.icon} alt="icon" style={{ width: 18, height: 18, objectFit: 'contain', marginRight: 4 }} />
                      : (() => { try { const IconComp = require('@mui/icons-material')[cat.icon]; if (IconComp) return <IconComp fontSize="small" sx={{ mr: 0.5 }} />; } catch {} return null; })()
                    )}
                    {cat.name}
                  </span>
                );
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem 
                  key={category._id} 
                  value={category._id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {category.icon && (/^https?:\/\//.test(category.icon)
                    ? <img src={category.icon} alt="icon" style={{ width: 18, height: 18, objectFit: 'contain', marginRight: 4 }} />
                    : (() => { try { const IconComp = require('@mui/icons-material')[category.icon]; if (IconComp) return <IconComp fontSize="small" sx={{ mr: 0.5 }} />; } catch {} return null; })()
                  )}
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Deadline"
            name="deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.title}
        >
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTodoDialog; 