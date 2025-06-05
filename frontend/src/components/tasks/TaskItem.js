import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Checkbox,
  Box,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete, categories }) => {
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = deadline && deadline < new Date() && !task.completed;
  const category = categories.find(cat => cat._id === task.category);

  return (
    <Fade in>
      <Card
        sx={{
          bgcolor: task.completed ? 'action.disabledBackground' : 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
          position: 'relative',
          overflow: 'visible',
          opacity: task.completed ? 0.8 : 1,
          borderLeft: task.completed ? '5px solid #4caf50' : 'none',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleComplete(task._id, task.completed)}
              icon={<UncheckedIcon />}
              checkedIcon={<CheckCircleIcon color="success" />}
              sx={{
                mt: -1,
                ml: -1,
                '&:hover': {
                  bgcolor: 'transparent',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                },
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.completed ? 'line-through 1.5px' : 'none',
                  color: task.completed ? 'text.disabled' : 'text.primary',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:after': task.completed ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    width: '100%',
                    height: '1.5px',
                    backgroundColor: 'text.disabled',
                    transition: 'width 0.3s ease',
                  } : {},
                }}
              >
                {task.title}
              </Typography>
              {task.description && (
                <Typography
                  variant="body2"
                  color={task.completed ? 'text.disabled' : 'text.secondary'}
                  sx={{
                    mt: 1,
                    mb: 2,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    textDecoration: task.completed ? 'line-through 1.5px' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {task.description}
                </Typography>
              )}
            </Box>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {category && (
              <Chip
                label={category.name}
                size="small"
                sx={{
                  bgcolor: category.color || '#2196f3',
                  color: '#fff',
                  opacity: task.completed ? 0.6 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              />
            )}
            <Chip
              label={task.priority}
              size="small"
              color={
                task.priority === 'high'
                  ? 'error'
                  : task.priority === 'medium'
                  ? 'warning'
                  : 'success'
              }
              sx={{
                opacity: task.completed ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />
            {deadline && (
              <Chip
                icon={isOverdue ? <WarningAmberIcon /> : null}
                label={deadline.toLocaleString()}
                size="small"
                color={isOverdue ? 'error' : 'default'}
                sx={{
                  opacity: task.completed ? 0.6 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              />
            )}
            <Chip
              label={task.completed ? "Completed" : "In Progress"}
              size="small"
              color={task.completed ? "success" : "default"}
              variant={task.completed ? "filled" : "outlined"}
              sx={{
                transition: 'all 0.3s ease',
                fontWeight: task.completed ? 'bold' : 'normal',
              }}
            />
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
            <IconButton
              size="small"
              onClick={() => onEdit(task)}
              sx={{
                mr: 1,
                opacity: task.completed ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(task._id)}
              sx={{
                opacity: task.completed ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default TaskItem; 