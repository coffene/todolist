import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const API_URL = 'http://localhost:5000/api';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title: newTask,
        deadline: deadline || null
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
      setDeadline('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleComplete = async (taskId, completed) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, {
        completed: !completed
      });
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEdit = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setEditingTask(task);
    setNewTask(task.title);
    setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/tasks/${editingTask.id}`, {
        title: newTask,
        deadline: deadline || null
      });
      setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task));
      setEditingTask(null);
      setNewTask('');
      setDeadline('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Todo List
        </Typography>
        <form onSubmit={editingTask ? handleUpdate : handleSubmit} className="mb-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              className="border p-2 rounded"
            />
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
        <Box sx={{ mt: 4 }}>
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between border p-2 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleComplete(task.id, task.completed)}
                    className="h-4 w-4"
                  />
                  <span className={task.completed ? 'line-through' : ''}>
                    {task.title}
                  </span>
                  {task.deadline && (
                    <span className="text-sm text-gray-500">
                      (Due: {formatDate(task.deadline)})
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoList; 