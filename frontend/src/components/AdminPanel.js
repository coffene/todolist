import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Typography, Paper, Alert, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAll();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes, tasksRes] = await Promise.all([
        axios.get(`${API}/stats`, { params: { admin_id: user._id } }),
        axios.get(`${API}/users`, { params: { admin_id: user._id } }),
        axios.get(`${API}/tasks`, { params: { admin_id: user._id } })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`${API}/users/${uid}`, { data: { admin_id: user._id } });
        setUsers(users.filter(u => u._id !== uid));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteTask = async (tid) => {
    if (window.confirm('Delete this task?')) {
      try {
        await axios.delete(`${API}/tasks/${tid}`, { data: { admin_id: user._id } });
        setTasks(tasks.filter(t => t._id !== tid));
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <Alert severity="error">You do not have permission to access this page.</Alert>;
  }

  if (loading) return <Box sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Admin Panel</Typography>
        {stats && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}><Typography>Users: <b>{stats.users}</b></Typography></Grid>
            <Grid item xs={4}><Typography>Tasks: <b>{stats.tasks}</b></Typography></Grid>
            <Grid item xs={4}><Typography>Categories: <b>{stats.categories}</b></Typography></Grid>
          </Grid>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Quản lý người dùng</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u._id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    {u._id !== user._id && (
                      <IconButton color="error" onClick={() => handleDeleteUser(u._id)}><DeleteIcon /></IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Quản lý task</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(t => (
                <TableRow key={t._id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.user_id}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteTask(t._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default AdminPanel; 