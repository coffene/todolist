from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    deadline = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed,
            'deadline': self.deadline.isoformat() if self.deadline else None
        }

with app.app_context():
    db.create_all()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    deadline = None
    if 'deadline' in data and data['deadline']:
        deadline = datetime.fromisoformat(data['deadline'])
    task = Task(title=data['title'], deadline=deadline)
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
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

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True) 