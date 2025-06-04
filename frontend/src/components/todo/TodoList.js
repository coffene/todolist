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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import EditTodoDialog from './EditTodoDialog';

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

const TodoList = ({ searchQuery }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: !currentStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update todo');
      
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, status: !todo.status } : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete todo');
      
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  const handleEditSave = (updatedTodo) => {
    setTodos(todos.map(todo => 
      todo._id === updatedTodo._id ? updatedTodo : todo
    ));
    setEditingTodo(null);
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    todo.description?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  if (loading) return <LinearProgress />;

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid 
        container 
        spacing={3} 
        alignItems="flex-start"
        sx={{ 
          margin: 0,
          width: '100%',
        }}
      >
        {filteredTodos.map((todo) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={todo._id}
            sx={{
              paddingLeft: '0 !important',
              paddingRight: { xs: '0', sm: 3 },
              paddingTop: '24px !important',
            }}
          >
            <Fade in={true} timeout={500}>
              <TodoCard completed={todo.status}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Checkbox
                      checked={todo.status}
                      onChange={() => handleToggle(todo._id, todo.status)}
                      sx={{ mt: -1, mr: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <TitleTypography 
                        variant="h6" 
                        component="div" 
                        gutterBottom
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          lineHeight: 1.3,
                          mb: 1,
                        }}
                      >
                        {todo.title}
                      </TitleTypography>
                      {todo.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            mb: 2,
                            wordBreak: 'break-word',
                          }}
                        >
                          {todo.description}
                        </Typography>
                      )}
                      <Chip
                        size="small"
                        label={todo.status ? 'Completed' : 'Active'}
                        color={todo.status ? 'success' : 'primary'}
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        size="small"
                        label={new Date(todo.created_at).toLocaleDateString()}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 1,
                    mt: 'auto',
                  }}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="edit todo"
                    onClick={() => handleEdit(todo)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="delete todo"
                    onClick={() => handleDelete(todo._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TodoCard>
            </Fade>
          </Grid>
        ))}
        {filteredTodos.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">
                {searchQuery
                  ? 'No todos match your search'
                  : 'No todos yet. Add your first todo!'}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <EditTodoDialog
        open={editingTodo !== null}
        onClose={() => setEditingTodo(null)}
        onEdit={handleEditSave}
        todo={editingTodo}
      />
    </>
  );
};

export default TodoList; 