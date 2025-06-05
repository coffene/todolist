from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['todolist']
tasks = db['tasks']
categories = db['categories']

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    all_tasks = list(tasks.find())
    # Convert ObjectId to string for JSON serialization
    for task in all_tasks:
        task['_id'] = str(task['_id'])
    return jsonify(all_tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400

    task = {
        'title': data['title'],
        'completed': False,
        'deadline': datetime.fromisoformat(data['deadline']) if data.get('deadline') else None,
        'priority': data.get('priority', 'medium'),
        'category': data.get('category', ''),
        'description': data.get('description', ''),
        'created_at': datetime.now()
    }
    result = tasks.insert_one(task)
    task['_id'] = str(result.inserted_id)
    return jsonify(task), 201

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    update_fields = {}
    
    if 'completed' in data:
        update_fields['completed'] = data['completed']
    if 'title' in data:
        update_fields['title'] = data['title']
    if 'deadline' in data:
        update_fields['deadline'] = datetime.fromisoformat(data['deadline']) if data['deadline'] else None
    if 'priority' in data:
        update_fields['priority'] = data['priority']
    if 'category' in data:
        update_fields['category'] = data['category']
    if 'description' in data:
        update_fields['description'] = data['description']
    
    if update_fields:
        result = tasks.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': update_fields}
        )
        if result.modified_count:
            updated_task = tasks.find_one({'_id': ObjectId(task_id)})
            updated_task['_id'] = str(updated_task['_id'])
            return jsonify(updated_task)
    return jsonify({'error': 'Invalid data or task not found'}), 400

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    result = tasks.delete_one({'_id': ObjectId(task_id)})
    if result.deleted_count:
        return '', 204
    return jsonify({'error': 'Task not found'}), 404

# CATEGORY APIs
@app.route('/api/categories', methods=['GET'])
def get_categories():
    all_categories = list(categories.find())
    for cat in all_categories:
        cat['_id'] = str(cat['_id'])
    return jsonify(all_categories)

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.json
    name = data.get('name')
    color = data.get('color', '#2196f3')
    icon = data.get('icon', '')
    description = data.get('description', '')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    # Check unique name
    if categories.find_one({'name': name}):
        return jsonify({'error': 'Category name must be unique'}), 400
    cat = {
        'name': name,
        'color': color,
        'icon': icon,
        'description': description
    }
    result = categories.insert_one(cat)
    cat['_id'] = str(result.inserted_id)
    return jsonify(cat), 201

@app.route('/api/categories/<cat_id>', methods=['PUT'])
def update_category(cat_id):
    data = request.json
    update_fields = {}
    for field in ['name', 'color', 'icon', 'description']:
        if field in data:
            update_fields[field] = data[field]
    if not update_fields:
        return jsonify({'error': 'No fields to update'}), 400
    result = categories.update_one({'_id': ObjectId(cat_id)}, {'$set': update_fields})
    if result.modified_count:
        cat = categories.find_one({'_id': ObjectId(cat_id)})
        cat['_id'] = str(cat['_id'])
        return jsonify(cat)
    return jsonify({'error': 'Category not found or not updated'}), 404

@app.route('/api/categories/<cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    result = categories.delete_one({'_id': ObjectId(cat_id)})
    if result.deleted_count:
        return '', 204
    return jsonify({'error': 'Category not found'}), 404

if __name__ == '__main__':
    app.run(debug=True) 