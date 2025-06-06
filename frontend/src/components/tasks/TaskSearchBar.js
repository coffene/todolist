import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

const TaskSearchBar = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterSelect = (newFilter) => {
    onFilterChange(newFilter);
    handleFilterClose();
  };

  const handleSortSelect = (newSort) => {
    onSortChange(newSort);
    handleSortClose();
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <IconButton onClick={handleFilterClick}>
        <FilterIcon color={filter !== 'all' ? 'primary' : 'default'} />
      </IconButton>
      <IconButton onClick={handleSortClick}>
        <SortIcon color={sort !== 'created' ? 'primary' : 'default'} />
      </IconButton>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem
          onClick={() => handleFilterSelect('all')}
          selected={filter === 'all'}
        >
          All Tasks
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect('active')}
          selected={filter === 'active'}
        >
          Active Tasks
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect('completed')}
          selected={filter === 'completed'}
        >
          Completed Tasks
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem
          onClick={() => handleSortSelect('created')}
          selected={sort === 'created'}
        >
          Created Date
        </MenuItem>
        <MenuItem
          onClick={() => handleSortSelect('deadline')}
          selected={sort === 'deadline'}
        >
          Deadline
        </MenuItem>
        <MenuItem
          onClick={() => handleSortSelect('priority')}
          selected={sort === 'priority'}
        >
          Priority
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskSearchBar; 