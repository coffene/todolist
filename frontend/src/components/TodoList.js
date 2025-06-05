import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import { useContext } from 'react';
// Giả sử bạn có AuthContext hoặc props truyền user_id
// import { AuthContext } from '../contexts/AuthContext';

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

function TodoList(props) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [error, setError] = useState(null);
  // const { user } = useContext(AuthContext);
  // const user_id = user?._id || props.user_id;
  const user_id = props.user_id; // hoặc lấy từ context nếu có

  useEffect(() => {
    fetchTasks();
    // fetchCategories nếu có
  }, [user_id]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks?user_id=${user_id}`);
      setTasks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title: newTask,
        deadline: deadline || null,
        priority,
        category_id: category || null,
        notes,
        user_id
      });
      setTasks([...tasks, response.data]);
      resetForm();
      setError(null);
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleComplete = async (taskId, completed) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, {
        completed: !completed
      });
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleEdit = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    setEditingTask(task);
    setNewTask(task.title);
    setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
    setPriority(task.priority || 'medium');
    setCategory(task.category || '');
    setNotes(task.notes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/tasks/${editingTask._id}`, {
        title: newTask,
        deadline: deadline || null,
        priority,
        category_id: category || null,
        notes,
        user_id
      });
      setTasks(tasks.map(task => task._id === editingTask._id ? response.data : task));
      setEditingTask(null);
      resetForm();
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const resetForm = () => {
    setNewTask('');
    setDeadline('');
    setPriority('medium');
    setCategory('');
    setNotes('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return (
    <Container className="py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Todo List</h1>
          
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={editingTask ? handleUpdate : handleSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                className="form-control"
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-select"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (optional)"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="form-control"
                rows="2"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </form>

          <div className="row mb-3">
            <div className="col-md-6">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active Tasks</option>
                <option value="completed">Completed Tasks</option>
              </select>
            </div>
            <div className="col-md-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>
          </div>

          <div className="list-group">
            {sortedTasks.map(task => (
              <div key={task._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleComplete(task._id, task.completed)}
                      className="form-check-input"
                    />
                    <label className={`form-check-label ${task.completed ? 'text-decoration-line-through' : ''}`}>
                      {task.title}
                    </label>
                    <div className="mt-1">
                      {task.deadline && (
                        <small className="text-muted me-2">
                          Due: {formatDate(task.deadline)}
                        </small>
                      )}
                      {task.priority && (
                        <span className={`badge bg-${getPriorityColor(task.priority)} me-2`}>
                          {task.priority}
                        </span>
                      )}
                      {task.category && (
                        <span className="badge bg-info me-2">
                          {task.category}
                        </span>
                      )}
                    </div>
                    {task.notes && (
                      <small className="d-block text-muted mt-1">
                        {task.notes}
                      </small>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(task._id)}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default TodoList; 