import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Header from './components/layout/Header';
import TodoList from './components/todo/TodoList';
import AddTodoDialog from './components/todo/AddTodoDialog';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [todoListKey, setTodoListKey] = useState(0); // For forcing re-render

  // Create theme based on dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3', // A nice blue color
      },
      secondary: {
        main: '#f50057', // A pink accent color
      },
      background: {
        default: darkMode ? '#303030' : '#f5f5f5',
        paper: darkMode ? '#424242' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#1976d2',
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddTodo = (newTodo) => {
    // Force TodoList to re-fetch by changing its key
    setTodoListKey(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onSearch={handleSearch}
        />
        <Container
          maxWidth="md"
          sx={{
            mt: 10,
            pt: 3,
            pb: 6,
            px: { xs: 0, sm: 3 }, // Remove padding on mobile
          }}
        >
          <TodoList key={todoListKey} searchQuery={searchQuery} />
        </Container>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsAddDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <AddIcon />
        </Fab>
        <AddTodoDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddTodo}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
