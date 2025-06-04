import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const API_URL = 'http://localhost:5000/api';

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (todo) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todo);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, status) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { status });
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, status } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Todo List
        </Typography>
        <TodoForm onSubmit={addTodo} />
        <Box sx={{ mt: 4 }}>
          {todos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default TodoList; 