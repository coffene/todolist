import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Checkbox,
  Box,
  Fade,
  Chip,
  LinearProgress,
  List,
  TextField,
  InputAdornment,
  Stack,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  WarningAmber as WarningAmberIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import EditTodoDialog from './EditTodoDialog';
import CategoryManager from '../category/CategoryManager';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

// Styled components
const TodoCard = styled(Card)(({ theme, completed }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  ...(completed && {
    backgroundColor: theme.palette.action.disabledBackground,
    '& .MuiTypography-root': {
      textDecoration: 'line-through',
      color: theme.palette.text.disabled,
    },
  }),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  maxHeight: '100px',
  overflowY: 'auto',
  wordBreak: 'break-word',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.paper,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}));

// Helper: render icon from MUI name or URL
function renderIcon(icon) {
  if (!icon) return null;
  if (/^https?:\/\//.test(icon)) {
    return <img src={icon} alt="icon" style={{ width: 18, height: 18, objectFit: 'contain', marginRight: 4 }} />;
  }
  try {
    const IconComp = require('@mui/icons-material')[icon];
    if (IconComp) return <IconComp fontSize="small" sx={{ mr: 0.5 }} />;
  } catch {}
  return null;
}

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('created');
  const { user } = useAuth();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [user]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks?user_id=${user._id}`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/categories?user_id=${user._id}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    handleFilterClose();
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    handleSortClose();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return todo.status === 'pending';
    if (filter === 'completed') return todo.status === 'completed';
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
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

  const handleStatusChange = async (todoId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${todoId}`, {
        status: newStatus
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const handleAddTodo = (newTodo) => {
    setTodos(prev => [...prev, newTodo]);
  };

  const handleEditTodo = (updatedTodo) => {
    setTodos(prev => prev.map(t => t._id === updatedTodo._id ? updatedTodo : t));
  };

  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${todoId}`);
      setTodos(prev => prev.filter(t => t._id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton onClick={handleFilterClick}>
          <FilterIcon />
        </IconButton>
        <IconButton onClick={handleSortClick}>
          <SortIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleFilterChange('all')}>All</MenuItem>
        <MenuItem onClick={() => handleFilterChange('active')}>Active</MenuItem>
        <MenuItem onClick={() => handleFilterChange('completed')}>Completed</MenuItem>
      </Menu>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortChange('created')}>Created Date</MenuItem>
        <MenuItem onClick={() => handleSortChange('deadline')}>Deadline</MenuItem>
        <MenuItem onClick={() => handleSortChange('priority')}>Priority</MenuItem>
      </Menu>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip
          label={`All (${todos.length})`}
          color={filter === 'all' ? 'primary' : 'default'}
          onClick={() => handleFilterChange('all')}
        />
        <Chip
          label={`Active (${todos.filter(t => t.status === 'pending').length})`}
          color={filter === 'active' ? 'primary' : 'default'}
          onClick={() => handleFilterChange('active')}
        />
        <Chip
          label={`Completed (${todos.filter(t => t.status === 'completed').length})`}
          color={filter === 'completed' ? 'primary' : 'default'}
          onClick={() => handleFilterChange('completed')}
        />
      </Stack>

      <AddTodo open={addOpen} setOpen={setAddOpen} onAdd={handleAddTodo} />

      {sortedTodos.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No tasks found
        </Typography>
      ) : (
        <List>
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEditTodo}
              categories={categories}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default TodoList; 