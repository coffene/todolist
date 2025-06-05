import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Fab,
  Zoom,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../contexts/CategoryContext';
import TaskSearchBar from './TaskSearchBar';
import TaskItem from './TaskItem';
import AddTaskDialog from './AddTaskDialog';
import EditTaskDialog from './EditTaskDialog';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('created');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { user } = useAuth();
  const { categories, loading: loadingCategories } = useCategories();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks?user_id=${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setSnackbar({
        open: true,
        message: 'Failed to load tasks',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newTask,
          user_id: user._id
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const createdTask = await response.json();
      setTasks(prevTasks => [createdTask, ...prevTasks]);
      setAddDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Task added successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create task',
        severity: 'error',
      });
    }
  };

  const handleToggleComplete = async (taskId, currentCompleted) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Toggling task completion:', taskId, 'Current status:', currentCompleted);
      
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          completed: !currentCompleted
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      console.log('Updated task:', updatedTask);
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, completed: !currentCompleted } : task
        )
      );
      
      setSnackbar({
        open: true,
        message: `Task marked as ${!currentCompleted ? 'completed' : 'active'}`,
        severity: 'success',
      });
    } catch (err) {
      console.error('Error updating task:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update task status',
        severity: 'error',
      });
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const savedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === savedTask._id ? savedTask : task
        )
      );
      setEditingTask(null);
      setSnackbar({
        open: true,
        message: 'Task updated successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error updating task:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update task',
        severity: 'error',
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete task',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'created') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sort === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  if (loading || loadingCategories) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 8 }}>
      <TaskSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
      />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip
          label={`All (${tasks.length})`}
          color={filter === 'all' ? 'primary' : 'default'}
          onClick={() => setFilter('all')}
        />
        <Chip
          label={`Active (${tasks.filter(t => !t.completed).length})`}
          color={filter === 'active' ? 'primary' : 'default'}
          onClick={() => setFilter('active')}
        />
        <Chip
          label={`Completed (${tasks.filter(t => t.completed).length})`}
          color={filter === 'completed' ? 'primary' : 'default'}
          onClick={() => setFilter('completed')}
        />
      </Stack>

      {sortedTasks.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No tasks found
        </Typography>
      ) : (
        <Stack spacing={2}>
          {sortedTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={() => setEditingTask(task)}
              onDelete={handleDeleteTask}
              categories={categories}
            />
          ))}
        </Stack>
      )}

      <Zoom in>
        <Fab
          color="primary"
          aria-label="add task"
          onClick={() => setAddDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddTask}
        categories={categories}
      />

      <EditTaskDialog
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onEdit={handleEditTask}
        categories={categories}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskList; 