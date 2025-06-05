import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
  Popover,
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ChromePicker } from 'react-color';

const API_URL = 'http://localhost:5000/api/categories';
const defaultForm = { name: '', color: '#2196f3', icon: '', description: '' };

function renderIcon(icon) {
  if (!icon) return null;
  if (/^https?:\/\//.test(icon)) {
    return <img src={icon} alt="icon" style={{ width: 24, height: 24, objectFit: 'contain', marginRight: 8 }} />;
  }
  try {
    const IconComp = require('@mui/icons-material')[icon];
    if (IconComp) return <IconComp fontSize="small" sx={{ mr: 1 }} />;
  } catch {}
  return null;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingCategory, setEditingCategory] = useState(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuAnchorEls, setMenuAnchorEls] = useState({});

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpen = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        description: cat.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData(defaultForm);
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setFormData(defaultForm);
    setShowColorPicker(false);
    setColorAnchorEl(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    try {
      const url = editingCategory ? `${API_URL}/${editingCategory._id}` : API_URL;
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Error');
        setLoading(false);
        return;
      }
      const savedCategory = await res.json();
      if (editingCategory) {
        setCategories(categories.map(cat => 
          cat._id === savedCategory._id ? savedCategory : cat
        ));
      } else {
        setCategories([...categories, savedCategory]);
      }
      handleClose();
    } catch (err) {
      setError('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  // Dropdown menu handlers
  const handleMenuOpen = (event, id) => {
    setMenuAnchorEls({ ...menuAnchorEls, [id]: event.currentTarget });
  };
  const handleMenuClose = (id) => {
    setMenuAnchorEls({ ...menuAnchorEls, [id]: null });
  };

  // Color picker popover
  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
    setShowColorPicker(true);
  };
  const handleColorClose = () => {
    setShowColorPicker(false);
    setColorAnchorEl(null);
  };
  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, color: color.hex }));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Category Manager
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Category</Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}
      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat._id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', borderLeft: `8px solid ${cat.color}`, minHeight: 120 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {renderIcon(cat.icon)}
                  <Typography variant="h6" sx={{ fontWeight: 600, ml: cat.icon ? 1 : 0 }}>{cat.name}</Typography>
                </Box>
                {cat.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{cat.description}</Typography>
                )}
                <Chip size="small" label={cat.color} sx={{ bgcolor: cat.color, color: '#fff', fontWeight: 600 }} />
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <IconButton onClick={(e) => handleMenuOpen(e, cat._id)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEls[cat._id]}
                  open={Boolean(menuAnchorEls[cat._id])}
                  onClose={() => handleMenuClose(cat._id)}
                >
                  <MenuItem onClick={() => { handleMenuClose(cat._id); handleOpen(cat); }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(cat._id); handleDelete(cat._id); }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} color="error" /> Delete
                  </MenuItem>
                </Menu>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth scroll="body">
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Icon (MUI name hoặc URL)"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              sx={{ mb: 2 }}
              helperText="Ví dụ: 'Category', 'Home', hoặc link ảnh"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleColorClick}
                sx={{
                  backgroundColor: formData.color,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: formData.color,
                    opacity: 0.9,
                  },
                }}
              >
                Pick Color
              </Button>
              <Popover
                open={showColorPicker}
                anchorEl={colorAnchorEl}
                onClose={handleColorClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              >
                <Box sx={{ p: 2 }}>
                  <ChromePicker color={formData.color} onChange={handleColorChange} disableAlpha />
                </Box>
              </Popover>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.name}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 