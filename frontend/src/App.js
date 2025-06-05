import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, List as ListIcon, Category as CategoryIcon, Add as AddIcon } from '@mui/icons-material';
import TodoList from './components/todo/TodoList';
import CategoryManager from './components/category/CategoryManager';
import AddTodo from './components/todo/AddTodo';

function App() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch todos from backend on mount
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks');
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        // handle error
      }
    };
    fetchTodos();
  }, []);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handleNavigate = (path) => {
    navigate(path);
    setMenuAnchorEl(null);
  };

  // Khi thêm task mới
  const handleAddNew = (newTask) => {
    setTodos(prev => [newTask, ...prev]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open menu"
            edge="start"
            onClick={handleMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem onClick={() => handleNavigate('/')}> <ListIcon fontSize="small" sx={{ mr: 1 }} /> Tasks </MenuItem>
            <MenuItem onClick={() => handleNavigate('/categories')}> <CategoryIcon fontSize="small" sx={{ mr: 1 }} /> Categories </MenuItem>
          </Menu>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            TodoList
          </Typography>
          <IconButton
            color="inherit"
            aria-label="add task"
            onClick={() => setAddOpen(true)}
            sx={{ ml: 2 }}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AddTodo open={addOpen} setOpen={setAddOpen} onAdd={handleAddNew} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          ml: 0,
        }}
      >
        <Container maxWidth="lg">
          <Routes>
            <Route
              path="/"
              element={
                <TodoList todos={todos} setTodos={setTodos} searchQuery={searchQuery} />
              }
            />
            <Route path="/categories" element={<CategoryManager />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
