# TodoList Project

Đây là một ứng dụng TodoList đơn giản được xây dựng với Flask (Backend) và React (Frontend).

## Cấu trúc dự án

```
todolist/
├── backend/           # Flask backend
│   ├── app.py        # File chính của backend
│   └── requirements.txt
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── TodoList.js   # Component chính quản lý danh sách
    │   │   ├── TodoForm.js   # Form thêm todo mới
    │   │   └── TodoItem.js   # Component hiển thị từng todo
    │   └── App.js
    └── package.json
```

## Hướng dẫn cài đặt

### Backend (Flask)

1. Cài đặt Python và MongoDB:
   - Python 3.x
   - MongoDB Community Edition

2. Tạo môi trường ảo và cài đặt dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

3. Chạy backend:
```bash
python app.py
```
Backend sẽ chạy tại http://localhost:5000

### Frontend (React)

1. Cài đặt Node.js và npm

2. Cài đặt dependencies:
```bash
cd frontend
npm install
```

3. Chạy frontend:
```bash
npm start
```
Frontend sẽ chạy tại http://localhost:3000

## API Endpoints

Backend cung cấp các API sau:

1. Lấy danh sách todos:
```
GET /api/todos
```

2. Thêm todo mới:
```
POST /api/todos
Body: {
    "title": "string",
    "description": "string"
}
```

3. Cập nhật trạng thái todo:
```
PUT /api/todos/<todo_id>
Body: {
    "status": boolean
}
```

4. Xóa todo:
```
DELETE /api/todos/<todo_id>
```

## Cách làm việc với dự án

### Backend Developer

1. Quản lý file `backend/app.py`:
   - Thêm/sửa/xóa API endpoints
   - Xử lý logic nghiệp vụ
   - Kết nối với MongoDB

2. Các bước phát triển:
   - Đọc hiểu code hiện tại
   - Thêm validation cho API
   - Xử lý lỗi
   - Tối ưu database queries

### Frontend Developer

1. Quản lý thư mục `frontend/src/components/`:
   - `TodoList.js`: Component chính quản lý state và gọi API
   - `TodoForm.js`: Form thêm todo mới
   - `TodoItem.js`: Hiển thị từng todo item

2. Các bước phát triển:
   - Đọc hiểu cấu trúc components
   - Thêm tính năng mới vào UI
   - Cải thiện UX
   - Xử lý lỗi và loading states

## Cách phối hợp

1. Sử dụng Git:
```bash
# Tạo branch mới
git checkout -b feature/ten-tinh-nang

# Commit thay đổi
git add .
git commit -m "[Backend/Frontend] Mô tả thay đổi"

# Push lên remote
git push origin feature/ten-tinh-nang
```

2. Quy ước commit message:
- [Backend] Thêm API mới
- [Frontend] Cải thiện UI
- [Fix] Sửa lỗi...

3. Code review:
- Tạo Pull Request
- Review code cho nhau
- Merge sau khi được approve

## Tài liệu tham khảo

1. Flask:
   - [Flask Documentation](https://flask.palletsprojects.com/)
   - [Flask-MongoDB](https://flask-pymongo.readthedocs.io/)

2. React:
   - [React Documentation](https://reactjs.org/)
   - [Material-UI](https://mui.com/)

3. MongoDB:
   - [MongoDB Documentation](https://docs.mongodb.com/)

## Hỗ trợ

Nếu có thắc mắc, hãy:
1. Đọc kỹ tài liệu
2. Kiểm tra code hiện tại
3. Hỏi team member
4. Tìm kiếm trên Google/Stack Overflow
