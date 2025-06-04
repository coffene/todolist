# Hướng dẫn Backend TodoList

## 1. Cấu trúc và Setup

### 1.1. Các thư viện cần thiết
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os
```

Giải thích:
- `Flask`: Framework web để tạo API
- `CORS`: Cho phép frontend truy cập API
- `MongoClient`: Kết nối với MongoDB
- `ObjectId`: Chuyển đổi ID của MongoDB

### 1.2. Khởi tạo Flask và CORS
```python
app = Flask(__name__)
CORS(app)  # Cho phép frontend truy cập API
app.secret_key = 'your-secret-key'  # Dùng cho session
```

### 1.3. Kết nối MongoDB
```python
client = MongoClient('mongodb://localhost:27017/')
db = client['todolist']
todos = db['todos']
```

## 2. API Endpoints

### 2.1. Lấy danh sách todos
```python
@app.route('/api/todos', methods=['GET'])
def get_todos():
    all_todos = list(todos.find())
    # Chuyển ObjectId thành string để JSON có thể serialize
    for todo in all_todos:
        todo['_id'] = str(todo['_id'])
    return jsonify(all_todos)
```

Cách sử dụng:
```bash
curl http://localhost:5000/api/todos
```

### 2.2. Thêm todo mới
```python
@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    
    if title:
        todo = {
            'title': title,
            'description': description,
            'status': False,
            'created_at': datetime.now()
        }
        result = todos.insert_one(todo)
        todo['_id'] = str(result.inserted_id)
        return jsonify(todo), 201
    return jsonify({'error': 'Title is required'}), 400
```

Cách sử dụng:
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test todo","description":"Test description"}'
```

### 2.3. Cập nhật trạng thái todo
```python
@app.route('/api/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    status = data.get('status')
    
    if status is not None:
        result = todos.update_one(
            {'_id': ObjectId(todo_id)},
            {'$set': {'status': status}}
        )
        if result.modified_count:
            return jsonify({'message': 'Todo updated successfully'})
    return jsonify({'error': 'Invalid data'}), 400
```

Cách sử dụng:
```bash
curl -X PUT http://localhost:5000/api/todos/<todo_id> \
  -H "Content-Type: application/json" \
  -d '{"status":true}'
```

### 2.4. Xóa todo
```python
@app.route('/api/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    result = todos.delete_one({'_id': ObjectId(todo_id)})
    if result.deleted_count:
        return jsonify({'message': 'Todo deleted successfully'})
    return jsonify({'error': 'Todo not found'}), 404
```

Cách sử dụng:
```bash
curl -X DELETE http://localhost:5000/api/todos/<todo_id>
```

## 3. Cấu trúc dữ liệu

### 3.1. Todo Document
```json
{
    "_id": "ObjectId",
    "title": "string",
    "description": "string",
    "status": boolean,
    "created_at": "datetime"
}
```

## 4. Cách chạy

1. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

2. Chạy server:
```bash
python app.py
```

Server sẽ chạy tại http://localhost:5000

## 5. Lưu ý quan trọng

1. Đảm bảo MongoDB đã được cài đặt và chạy
2. Kiểm tra kết nối database trước khi chạy
3. Xử lý lỗi khi gọi API
4. Backup database thường xuyên

## 6. Mở rộng

Có thể thêm các tính năng:
1. Authentication
2. Validation dữ liệu
3. Tìm kiếm và lọc
4. Phân trang
5. Logging 