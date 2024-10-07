from app.utils.extensions import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True,
                      nullable=False) 
    role = db.Column(db.String(50), nullable=False)
    tasks_assigned = db.relationship(
        'Task', backref='assigned_user', lazy=True, foreign_keys='Task.assigned_user_id')

    # Foreign key for tasks where the user created the task (created_by)
    tasks_created = db.relationship(
        'Task', backref='creator', lazy=True, foreign_keys='Task.creator_id')

    task_lists = db.relationship('TaskList', backref='owner', lazy=True)


class TaskList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tasks = db.relationship('Task', backref='task_list', lazy=True)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='Not Started')
    assigned_user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=True)  # The user assigned to the task
    creator_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)  # The user who created the task
    task_list_id = db.Column(db.Integer, db.ForeignKey(
        'task_list.id'), nullable=False)  # The task list this task belongs to
    # Auto-set creation timestamp
    created_at = db.Column(db.DateTime, nullable=False,
                           default=db.func.current_timestamp())
