import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function TodoItem({ todo, onUpdate, onDelete }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary'
              }}
            >
              {todo.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {todo.description}
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={() => onUpdate(todo._id, !todo.completed)}
              color={todo.completed ? 'success' : 'default'}
            >
              {todo.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
            </IconButton>
            <IconButton onClick={() => onDelete(todo._id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TodoItem; 