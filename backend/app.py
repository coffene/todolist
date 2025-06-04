from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.secret_key = 'your-secret-key'  # Thay đổi secret key này trong môi trường production

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['todolist']
todos = db['todos']

@app.route('/api/todos', methods=['GET'])
def get_todos():
    all_todos = list(todos.find())
    # Convert ObjectId to string for JSON serialization
    for todo in all_todos:
        todo['_id'] = str(todo['_id'])
    return jsonify(all_todos)

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

@app.route('/api/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    update_fields = {}
    
    # Kiểm tra và thêm các trường cần update
    if 'status' in data:
        update_fields['status'] = data['status']
    if 'title' in data:
        update_fields['title'] = data['title']
    if 'description' in data:
        update_fields['description'] = data['description']
    
    if update_fields:
        result = todos.update_one(
            {'_id': ObjectId(todo_id)},
            {'$set': update_fields}
        )
        if result.modified_count:
            # Lấy todo đã cập nhật để trả về
            updated_todo = todos.find_one({'_id': ObjectId(todo_id)})
            if updated_todo:
                updated_todo['_id'] = str(updated_todo['_id'])
                return jsonify(updated_todo)
    return jsonify({'error': 'Invalid data or todo not found'}), 400

@app.route('/api/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    result = todos.delete_one({'_id': ObjectId(todo_id)})
    if result.deleted_count:
        return jsonify({'message': 'Todo deleted successfully'})
    return jsonify({'error': 'Todo not found'}), 404

if __name__ == '__main__':
    app.run(debug=True) 