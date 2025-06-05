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
  WarningAmber as WarningAmberIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import EditTodoDialog from './EditTodoDialog';
import CategoryManager from '../category/CategoryManager';

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

const TodoList = ({ todos, setTodos, searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    setLoading(false);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      // ignore
    }
  };

  const handleToggle = async (id, currentCompleted) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentCompleted }),
      });
      
      if (!response.ok) throw new Error('Failed to update todo');
      
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
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

  const getCategoryInfo = (catId) => {
    if (!catId) return null;
    return categories.find(c => c._id === catId) || null;
  };

  // Sắp xếp tự nhiên: deadline tăng dần, không có deadline xuống cuối, cùng deadline thì created_at mới nhất lên trước
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.deadline && b.deadline) {
      const da = new Date(a.deadline);
      const db = new Date(b.deadline);
      if (da.getTime() !== db.getTime()) return da - db;
      // Nếu cùng deadline, sort theo created_at mới nhất lên trước
      if (a.created_at && b.created_at) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    }
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;
    // Không có deadline, sort theo created_at mới nhất lên trước
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  const filteredTodos = sortedTodos.filter(todo =>
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
        {filteredTodos.map((todo) => {
          const catInfo = getCategoryInfo(todo.category);
          return (
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
                display: 'flex',
                alignItems: 'stretch',
              }}
            >
              <Fade in={true} timeout={500}>
                <TodoCard completed={todo.completed} sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 220 }}>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => handleToggle(todo._id, todo.completed)}
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
                          label={todo.completed ? 'Completed' : 'Active'}
                          color={todo.completed ? 'success' : 'primary'}
                          sx={{ mr: 1 }}
                        />
                        {todo.priority && (
                          <Chip
                            size="small"
                            label={todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                            icon={<span style={{
                              display: 'inline-block',
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor:
                                todo.priority === 'high' ? '#d32f2f' :
                                todo.priority === 'medium' ? '#fbc02d' :
                                '#388e3c',
                            }} />}
                            sx={{ mr: 1, fontWeight: 600, border: '2px solid', borderColor:
                              todo.priority === 'high' ? '#d32f2f' :
                              todo.priority === 'medium' ? '#fbc02d' :
                              '#388e3c',
                              color: 'inherit',
                              bgcolor: 'background.paper',
                            }}
                          />
                        )}
                        {catInfo && (
                          <Chip
                            size="small"
                            label={
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                {renderIcon(catInfo.icon)}
                                {catInfo.name}
                              </span>
                            }
                            sx={{ mr: 1, bgcolor: catInfo.color, color: '#fff', fontWeight: 600, border: 'none' }}
                          />
                        )}
                        {!catInfo && todo.category && (
                          <Chip size="small" label="Unknown" color="default" sx={{ mr: 1 }} />
                        )}
                        {todo.deadline && (
                          <Chip
                            size="small"
                            label={(() => {
                              const deadlineDate = new Date(todo.deadline);
                              const now = new Date();
                              const isOverdue = !todo.completed && deadlineDate < now;
                              return (
                                <span style={{ color: isOverdue ? '#d32f2f' : undefined, fontWeight: 600 }}>
                                  {deadlineDate.toLocaleString()} {isOverdue && <WarningAmberIcon fontSize="small" sx={{ color: '#d32f2f', ml: 0.5 }} />}
                                </span>
                              );
                            })()}
                            variant={(() => {
                              const deadlineDate = new Date(todo.deadline);
                              const now = new Date();
                              return !todo.completed && deadlineDate < now ? 'filled' : 'outlined';
                            })()}
                            sx={{ mr: 1, borderColor: '#d32f2f' }}
                          />
                        )}
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
          );
        })}
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