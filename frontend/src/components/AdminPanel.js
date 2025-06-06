import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Typography, Paper, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
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
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API}/stats`, { params: { admin_id: user._id } }),
        axios.get(`${API}/users`, { params: { admin_id: user._id } })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
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

  if (!user || user.role !== 'admin') {
    return <Alert severity="error">You do not have permission to access this page.</Alert>;
  }

  if (loading) return <Box sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Admin Panel</Typography>
        {stats && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Tổng quan</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}><Typography>Users: <b>{stats.users}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Categories: <b>{stats.categories}</b></Typography></Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>Thống kê người dùng</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}><Typography>Người dùng mới (24h): <b>{stats.new_users_24h}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Người dùng hoạt động (24h): <b>{stats.active_users_24h}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Tỷ lệ người dùng admin: <b>{stats.admin_ratio}%</b></Typography></Grid>
              <Grid item xs={6}><Typography>Người dùng chưa xác thực: <b>{stats.unverified_users}</b></Typography></Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>Thống kê hoạt động</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}><Typography>Tasks mới (24h): <b>{stats.new_tasks_24h}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Tasks hoàn thành (24h): <b>{stats.completed_tasks_24h}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Categories mới (24h): <b>{stats.new_categories_24h}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Tỷ lệ hoàn thành task: <b>{stats.completion_rate}%</b></Typography></Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>Thống kê theo thời gian</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography>Người dùng mới (7 ngày): <b>{stats.new_users_7d}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Tasks mới (7 ngày): <b>{stats.new_tasks_7d}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Người dùng mới (30 ngày): <b>{stats.new_users_30d}</b></Typography></Grid>
              <Grid item xs={6}><Typography>Tasks mới (30 ngày): <b>{stats.new_tasks_30d}</b></Typography></Grid>
            </Grid>
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
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
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default AdminPanel; 