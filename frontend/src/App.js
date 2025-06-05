import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Fab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  List as ListIcon,
  Category as CategoryIcon,
  Add as AddIcon,
  AccountCircle,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CategoryProvider } from './contexts/CategoryContext';
import TaskList from './components/tasks/TaskList';
import CategoryManager from './components/category/CategoryManager';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AdminPanel from './components/AdminPanel';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Main App component
function App() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const { user, logout } = useAuth();

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
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
          >
            <MenuItem component="a" href="/">
              <ListIcon fontSize="small" sx={{ mr: 1 }} /> Tasks
            </MenuItem>
            <MenuItem component="a" href="/categories">
              <CategoryIcon fontSize="small" sx={{ mr: 1 }} /> Categories
            </MenuItem>
            {user && user.role === 'admin' && (
              <MenuItem component="a" href="/admin">
                <AccountCircle fontSize="small" sx={{ mr: 1 }} /> Admin Panel
              </MenuItem>
            )}
          </Menu>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            TodoList
          </Typography>
          {user ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" href="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          ml: 0,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <CategoryManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

// Wrap the app with Providers
export default function AppWithProviders() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <App />
          </LocalizationProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}
