import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
} from '@mui/material';

const AddTodoDialog = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [deadlineError, setDeadlineError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingCat(true);
      fetch('http://localhost:5000/api/categories')
        .then(res => res.json())
        .then(data => setCategories(data))
        .finally(() => setLoadingCat(false));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    }
    if (!deadline) {
      setDeadlineError(true);
      hasError = true;
    }
    if (hasError) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          category_id: category || null,
          deadline,
        }),
      });

      if (!response.ok) throw new Error('Failed to add todo');

      const newTodo = await response.json();
      onAdd(newTodo);
      handleClose();
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('');
    setDeadline('');
    setTitleError(false);
    setDeadlineError(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Todo</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(false);
              }}
              error={titleError}
              helperText={titleError ? 'Title is required' : ''}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              fullWidth
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              SelectProps={{ displayEmpty: true }}
              disabled={loadingCat}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat._id} value={cat._id}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, background: cat.color, borderRadius: '50%', marginRight: 8 }} />
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Deadline"
              type="datetime-local"
              fullWidth
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                setDeadlineError(false);
              }}
              error={deadlineError}
              helperText={deadlineError ? 'Deadline is required' : ''}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Todo
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTodoDialog; 