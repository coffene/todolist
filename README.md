# TodoList Application

Ứng dụng quản lý công việc (Todo List) với đầy đủ tính năng, được xây dựng bằng React và Flask.

## Tính năng chính

### Quản lý Tasks
- Tạo, sửa, xóa tasks
- Đánh dấu hoàn thành/chưa hoàn thành
- Gán priority (cao/trung bình/thấp)
- Đặt deadline
- Thêm mô tả chi tiết
- Tìm kiếm và lọc tasks
- Sắp xếp theo nhiều tiêu chí

### Quản lý Categories
- Tạo và quản lý categories
- Gán màu sắc và icon cho categories
- Phân loại tasks theo categories
- Thống kê số lượng tasks trong mỗi category

### Người dùng
- Đăng ký và đăng nhập
- Quản lý thông tin cá nhân
- Tùy chỉnh giao diện
- Phân quyền admin/user

### Admin Panel
- Quản lý người dùng
- Thống kê hệ thống
- Theo dõi hoạt động

## Công nghệ sử dụng

### Frontend
- React.js
- Material-UI
- React Context API
- Axios
- React Router

### Backend
- Flask (Python)
- MongoDB
- JWT Authentication
- Flask-CORS

## Cài đặt

### Yêu cầu
- Node.js (v14+)
- Python (v3.8+)
- MongoDB

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Cấu trúc dự án

```
todolist/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── tasks/
│       │   ├── categories/
│       │   ├── auth/
│       │   └── AdminPanel.js
│       ├── contexts/
│       ├── App.js
│       └── index.js
└── backend/
    ├── app.py
    ├── models.py
    └── requirements.txt
```

## API Endpoints

### User APIs
- `POST /api/users` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/<id>` - Lấy thông tin user
- `PUT /api/users/<id>` - Cập nhật user

### Task APIs
- `GET /api/tasks` - Lấy danh sách tasks
- `POST /api/tasks` - Tạo task mới
- `PUT /api/tasks/<id>` - Cập nhật task
- `DELETE /api/tasks/<id>` - Xóa task

### Category APIs
- `GET /api/categories` - Lấy danh sách categories
- `POST /api/categories` - Tạo category mới
- `PUT /api/categories/<id>` - Cập nhật category
- `DELETE /api/categories/<id>` - Xóa category

### Admin APIs
- `GET /api/admin/stats` - Thống kê
- `GET /api/admin/users` - Quản lý users

## Tính năng bảo mật

- JWT Authentication
- Password hashing
- Role-based authorization
- Input validation
- CORS configuration

## Tính năng UI/UX

- Material Design
- Responsive layout
- Dark/Light theme
- Loading states
- Error handling
- Snackbar notifications

