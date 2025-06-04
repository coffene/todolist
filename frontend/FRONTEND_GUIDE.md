# Hướng dẫn Frontend TodoList

## 1. Cấu trúc và Setup

### 1.1. Các thư viện cần thiết
```json
{
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.11.16",
    "@mui/material": "^5.13.0",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

Giải thích:
- `@mui/material`: Thư viện UI components
- `@mui/icons-material`: Icons cho Material UI
- `axios`: Thư viện gọi API
- `react`: Framework frontend

### 1.2. Cấu trúc thư mục
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── TodoList.js
│   │   ├── TodoItem.js
│   │   └── AddTodo.js
│   ├── App.js
│   └── index.js
└── package.json
```

## 2. Components

### 2.1. TodoList Component
```jsx
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos từ API
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm todo mới
  const addTodo = async (title, description) => {
    try {
      const response = await axios.post('http://localhost:5000/api/todos', {
        title,
        description
      });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Cập nhật trạng thái todo
  const toggleTodo = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, {
        status: !status
      });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, status: !status } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Xóa todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
};
```

### 2.2. TodoItem Component
```jsx
const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{todo.title}</Typography>
        <Typography color="textSecondary">{todo.description}</Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant={todo.status ? "contained" : "outlined"}
            color="primary"
            onClick={() => onToggle(todo._id, todo.status)}
          >
            {todo.status ? "Completed" : "Mark Complete"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(todo._id)}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
```

### 2.3. AddTodo Component
```jsx
const AddTodo = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Add Todo
      </Button>
    </Box>
  );
};
```

## 3. Styling và Theme

### 3.1. Material UI Theme
```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

## 4. Cách chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm start
```

Ứng dụng sẽ chạy tại http://localhost:3000

## 5. Lưu ý quan trọng

1. Đảm bảo backend server đang chạy
2. Kiểm tra CORS configuration
3. Xử lý lỗi khi gọi API
4. Tối ưu performance với React.memo và useCallback
5. Sử dụng PropTypes để type checking

## 6. Mở rộng

Có thể thêm các tính năng:
1. Authentication và Authorization
2. Form validation
3. Tìm kiếm và lọc todos
4. Phân trang
5. Dark mode
6. Unit testing với Jest
7. E2E testing với Cypress

## 7. Best Practices

1. **Code Organization**
   - Tách components nhỏ, dễ tái sử dụng
   - Sử dụng custom hooks cho logic phức tạp
   - Tổ chức code theo feature

2. **Performance**
   - Sử dụng React.memo cho components
   - Tối ưu re-renders với useMemo và useCallback
   - Lazy loading cho routes

3. **Error Handling**
   - Xử lý lỗi API calls
   - Hiển thị thông báo lỗi user-friendly
   - Logging errors

4. **Testing**
   - Unit tests cho components
   - Integration tests cho features
   - E2E tests cho user flows 