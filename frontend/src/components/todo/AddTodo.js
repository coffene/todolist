import React from 'react';
import EditTodoDialog from './EditTodoDialog';

const AddTodo = ({ open, setOpen, onAdd }) => {
  const handleAdd = (newTodo) => {
    setOpen(false);
    if (onAdd && newTodo) onAdd(newTodo);
  };

  return (
    <EditTodoDialog
      open={open}
      onClose={() => setOpen(false)}
      onEdit={handleAdd}
    />
  );
};

export default AddTodo; 