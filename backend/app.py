from flask import Flask, request, jsonify, g
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
from models import User, Task, Category
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['todolist']
users = db['users']
tasks = db['tasks']
categories = db['categories']

# Helper function to convert ObjectId to string
def convert_id(obj):
    if isinstance(obj, dict):
        obj['_id'] = str(obj['_id'])
        if 'user_id' in obj:
            obj['user_id'] = str(obj['user_id'])
        if 'category_id' in obj:
            obj['category_id'] = str(obj['category_id'])
    return obj

# Middleware kiểm tra quyền admin
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = request.args.get('admin_id') or request.json.get('admin_id')
        if not user_id:
            return jsonify({'error': 'Admin ID required'}), 401
        user = users.find_one({'_id': ObjectId(user_id)})
        if not user or user.get('role') != 'admin':
            return jsonify({'error': 'Admin privilege required'}), 403
        g.admin_user = user
        return f(*args, **kwargs)
    return decorated

# USER APIs
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    if not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if username or email already exists
    if users.find_one({'$or': [{'username': data['username']}, {'email': data['email']}]}):
        return jsonify({'error': 'Username or email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        settings=data.get('settings'),
        role=data.get('role', 'user')
    )
    
    result = users.insert_one(user.to_dict())
    user_dict = user.to_dict()
    user_dict['_id'] = str(result.inserted_id)
    return jsonify(user_dict), 201

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(convert_id(user))

@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    update_fields = {}
    
    if 'settings' in data:
        update_fields['settings'] = data['settings']
    if 'password' in data:
        update_fields['password'] = generate_password_hash(data['password'])
    
    if not update_fields:
        return jsonify({'error': 'No fields to update'}), 400
    
    result = users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': update_fields}
    )
    
    if result.modified_count:
        user = users.find_one({'_id': ObjectId(user_id)})
        return jsonify(convert_id(user))
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/users/login', methods=['POST'])
def login_user():
    data = request.json
    # Cho phép đăng nhập bằng email hoặc username
    user = users.find_one({'$or': [
        {'email': data.get('email')},
        {'username': data.get('email')}
    ]})
    if not user or not check_password_hash(user['password'], data.get('password')):
        return jsonify({'error': 'Invalid email or password'}), 401
    user['_id'] = str(user['_id'])
    # Đảm bảo trả về trường role
    return jsonify({k: user[k] for k in user if k != 'password'})

# TASK APIs
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    user_id = request.args.get('user_id')
    query = {'user_id': ObjectId(user_id)} if user_id else {}
    all_tasks = list(tasks.find(query))
    return jsonify([convert_id(task) for task in all_tasks])

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    if not data.get('title') or not data.get('user_id'):
        return jsonify({'error': 'Title and user_id are required'}), 400

    task = Task(
        title=data['title'],
        user_id=data['user_id'],
        category_id=data.get('category_id'),
        description=data.get('description', ''),
        priority=data.get('priority', 'medium'),
        deadline=datetime.fromisoformat(data['deadline']) if data.get('deadline') else None
    )
    
    result = tasks.insert_one(task.to_dict())
    task_dict = task.to_dict()
    task_dict['_id'] = str(result.inserted_id)
    
    # Update category task count if category_id is provided
    if task.category_id:
        categories.update_one(
            {'_id': task.category_id},
            {'$inc': {'task_count': 1}}
        )
    
    return jsonify(convert_id(task_dict)), 201

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    task = tasks.find_one({'_id': ObjectId(task_id)})
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    update_fields = {}
    # Hỗ trợ cập nhật status từ completed
    if 'completed' in data:
        update_fields['status'] = 'completed' if data['completed'] else 'pending'
    for field in ['title', 'description', 'priority', 'status']:
        if field in data:
            update_fields[field] = data[field]
    if 'deadline' in data:
        update_fields['deadline'] = datetime.fromisoformat(data['deadline']) if data['deadline'] else None
    if 'category_id' in data:
        cat_id = data['category_id']
        if cat_id and cat_id != 'None':
            try:
                update_fields['category_id'] = ObjectId(cat_id)
            except Exception:
                update_fields['category_id'] = None
        else:
            update_fields['category_id'] = None
    if 'subtasks' in data:
        update_fields['subtasks'] = data['subtasks']
    if 'tags' in data:
        update_fields['tags'] = data['tags']
    update_fields['updated_at'] = datetime.now()
    if update_fields:
        # Handle category change
        if 'category_id' in update_fields and task.get('category_id') != update_fields['category_id']:
            # Decrease old category count
            if task.get('category_id'):
                categories.update_one(
                    {'_id': task['category_id']},
                    {'$inc': {'task_count': -1}}
                )
            # Increase new category count
            if update_fields['category_id']:
                categories.update_one(
                    {'_id': update_fields['category_id']},
                    {'$inc': {'task_count': 1}}
                )
        result = tasks.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': update_fields}
        )
        if result.modified_count:
            updated_task = tasks.find_one({'_id': ObjectId(task_id)})
            return jsonify(convert_id(updated_task))
    return jsonify({'error': 'No fields to update'}), 400

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = tasks.find_one({'_id': ObjectId(task_id)})
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    # Decrease category task count if task has category
    if task.get('category_id'):
        categories.update_one(
            {'_id': task['category_id']},
            {'$inc': {'task_count': -1}}
        )
    
    result = tasks.delete_one({'_id': ObjectId(task_id)})
    if result.deleted_count:
        return '', 204
    return jsonify({'error': 'Task not found'}), 404

# CATEGORY APIs
@app.route('/api/categories', methods=['GET'])
def get_categories():
    user_id = request.args.get('user_id')
    query = {'user_id': ObjectId(user_id)} if user_id else {}
    all_categories = list(categories.find(query))
    return jsonify([convert_id(cat) for cat in all_categories])

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.json
    if not data.get('name') or not data.get('user_id'):
        return jsonify({'error': 'Name and user_id are required'}), 400
    
    # Check unique name for the user
    if categories.find_one({'user_id': ObjectId(data['user_id']), 'name': data['name']}):
        return jsonify({'error': 'Category name must be unique for this user'}), 400
    
    category = Category(
        name=data['name'],
        user_id=data['user_id'],
        color=data.get('color', '#FF5733'),
        icon=data.get('icon', ''),
        description=data.get('description', '')
    )
    
    result = categories.insert_one(category.to_dict())
    category_dict = category.to_dict()
    category_dict['_id'] = str(result.inserted_id)
    return jsonify(convert_id(category_dict)), 201

@app.route('/api/categories/<cat_id>', methods=['PUT'])
def update_category(cat_id):
    data = request.json
    update_fields = {}
    for field in ['name', 'color', 'icon', 'description']:
        if field in data:
            update_fields[field] = data[field]
    
    if not update_fields:
        return jsonify({'error': 'No fields to update'}), 400
    
    # Check unique name if name is being updated
    if 'name' in update_fields:
        category = categories.find_one({'_id': ObjectId(cat_id)})
        if categories.find_one({
            '_id': {'$ne': ObjectId(cat_id)},
            'user_id': category['user_id'],
            'name': update_fields['name']
        }):
            return jsonify({'error': 'Category name must be unique for this user'}), 400
    
    result = categories.update_one(
        {'_id': ObjectId(cat_id)},
        {'$set': update_fields}
    )
    
    if result.modified_count:
        category = categories.find_one({'_id': ObjectId(cat_id)})
        return jsonify(convert_id(category))
    return jsonify({'error': 'Category not found'}), 404

@app.route('/api/categories/<cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    # Check if category has tasks
    if tasks.count_documents({'category_id': ObjectId(cat_id)}) > 0:
        return jsonify({'error': 'Cannot delete category with existing tasks'}), 400
    
    result = categories.delete_one({'_id': ObjectId(cat_id)})
    if result.deleted_count:
        return '', 204
    return jsonify({'error': 'Category not found'}), 404

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users():
    all_users = list(users.find())
    for u in all_users:
        u['_id'] = str(u['_id'])
        u.pop('password', None)
    return jsonify(all_users)

@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    # Không cho phép xóa chính mình
    if str(g.admin_user['_id']) == user_id:
        return jsonify({'error': 'Cannot delete yourself'}), 400
    result = users.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count:
        return '', 204
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_stats():
    try:
        # Tổng quan
        total_users = users.count_documents({})
        total_categories = categories.count_documents({})
        
        # Thống kê người dùng
        now = datetime.now()
        day_ago = now - timedelta(days=1)
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        new_users_24h = users.count_documents({'created_at': {'$gte': day_ago}})
        active_users_24h = users.count_documents({'last_active': {'$gte': day_ago}})
        admin_users = users.count_documents({'role': 'admin'})
        admin_ratio = round((admin_users / total_users * 100) if total_users > 0 else 0, 1)
        unverified_users = users.count_documents({'verified': False})
        
        # Thống kê hoạt động
        new_tasks_24h = tasks.count_documents({'created_at': {'$gte': day_ago}})
        completed_tasks_24h = tasks.count_documents({
            'completed': True,
            'updated_at': {'$gte': day_ago}
        })
        new_categories_24h = categories.count_documents({'created_at': {'$gte': day_ago}})
        
        total_tasks = tasks.count_documents({})
        completed_tasks = tasks.count_documents({'completed': True})
        completion_rate = round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
        
        # Thống kê theo thời gian
        new_users_7d = users.count_documents({'created_at': {'$gte': week_ago}})
        new_tasks_7d = tasks.count_documents({'created_at': {'$gte': week_ago}})
        new_users_30d = users.count_documents({'created_at': {'$gte': month_ago}})
        new_tasks_30d = tasks.count_documents({'created_at': {'$gte': month_ago}})
        
        return jsonify({
            'users': total_users,
            'categories': total_categories,
            'new_users_24h': new_users_24h,
            'active_users_24h': active_users_24h,
            'admin_ratio': admin_ratio,
            'unverified_users': unverified_users,
            'new_tasks_24h': new_tasks_24h,
            'completed_tasks_24h': completed_tasks_24h,
            'new_categories_24h': new_categories_24h,
            'completion_rate': completion_rate,
            'new_users_7d': new_users_7d,
            'new_tasks_7d': new_tasks_7d,
            'new_users_30d': new_users_30d,
            'new_tasks_30d': new_tasks_30d
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/tasks', methods=['GET'])
@admin_required
def admin_get_all_tasks():
    all_tasks = list(tasks.find())
    for t in all_tasks:
        t['_id'] = str(t['_id'])
        if 'user_id' in t:
            t['user_id'] = str(t['user_id'])
        if t.get('category_id'):
            t['category_id'] = str(t['category_id'])
    return jsonify(all_tasks)

@app.route('/api/admin/tasks/<task_id>', methods=['DELETE'])
@admin_required
def admin_delete_task(task_id):
    result = tasks.delete_one({'_id': ObjectId(task_id)})
    if result.deleted_count:
        return '', 204
    return jsonify({'error': 'Task not found'}), 404

if __name__ == '__main__':
    app.run(debug=True) 