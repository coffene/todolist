from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, username, email, password, settings=None, role='user'):
        self.username = username
        self.email = email
        self.password = password  # Should be hashed
        self.settings = settings or {
            "theme": "light",
            "notifications": True
        }
        self.role = role
        self.created_at = datetime.now()

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "settings": self.settings,
            "role": self.role,
            "created_at": self.created_at
        }

class Task:
    def __init__(self, title, user_id, category_id=None, description="", priority="medium", deadline=None):
        self.title = title
        self.user_id = ObjectId(user_id)
        self.category_id = ObjectId(category_id) if category_id else None
        self.description = description
        self.priority = priority
        self.deadline = deadline
        self.status = "pending"
        self.subtasks = []
        self.tags = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        return {
            "title": self.title,
            "user_id": self.user_id,
            "category_id": self.category_id,
            "description": self.description,
            "priority": self.priority,
            "deadline": self.deadline,
            "status": self.status,
            "subtasks": self.subtasks,
            "tags": self.tags,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

class Category:
    def __init__(self, name, user_id, color="#FF5733", icon="", description=""):
        self.name = name
        self.user_id = ObjectId(user_id)
        self.color = color
        self.icon = icon
        self.description = description
        self.task_count = 0
        self.created_at = datetime.now()

    def to_dict(self):
        return {
            "name": self.name,
            "user_id": self.user_id,
            "color": self.color,
            "icon": self.icon,
            "description": self.description,
            "task_count": self.task_count,
            "created_at": self.created_at
        } 