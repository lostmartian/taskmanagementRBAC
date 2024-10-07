from app.services.email_notification import send_email
from flask import Blueprint, request, jsonify
from app.models import Task, TaskList, User, db
from app.utils.auth import role_required
from app.services.email_notification import send_email
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone, timedelta

bp = Blueprint('tasks', __name__)


@bp.route('/task_lists/<int:id>/tasks', methods=['POST'])
@jwt_required()
# @role_required(['owner', 'admin'])
def add_task(id):
    data = request.get_json()
    current_user = get_jwt_identity()  # Get the currently logged-in user
    user = User.query.filter_by(username=current_user).first()

    # Check if task list exists
    task_list = TaskList.query.get_or_404(id)
    
    due_date_str = data['due_date']
    try:
        # First try to parse the date-time with seconds
        due_date_mod = datetime.strptime(due_date_str, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        try:
            # If seconds aren't provided, parse without them
            due_date_mod = datetime.strptime(due_date_str, '%Y-%m-%d %H:%M')
        except ValueError:
            return jsonify({"message": "Invalid date format. Expected YYYY-MM-DD HH:MM or YYYY-MM-DD HH:MM:SS"}), 400
        
    utc_time = due_date_mod.replace(tzinfo=timezone.utc)
    local_time = utc_time.astimezone()

    # print(local_time)

    # Create a new task and set the creator and assigned user
    new_task = Task(
        title=data['title'],
        description=data['description'],
        due_date=local_time,
        creator_id=user.id,  # Set the creator to the current user
        # Optionally assign a user
        assigned_user_id=data.get('assigned_user_id', None),
        task_list_id=id
    )



    # print(new_task.due_date)

    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message": "Task created successfully!", "task_id": new_task.id}), 201


@bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    current_user_id = get_jwt_identity()

    # print(current_user_id)
    # print(task)

    # Fetch the current user and check their role
    current_user = User.query.filter_by(username=current_user_id).first()

    # if not current_user:
    #     return jsonify({"message": "Sorry you don't have the necessary permissions"}), 404

    # Allow only admins and task list owners to update the task
    if current_user.role != 'admin' and current_user.id != task.task_list.owner_id:
        return jsonify({"message": "You do not have permission to update this task"}), 403

    # Proceed with updating the task
    data = request.get_json()

    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    print(task.title, task.description)

    due_date_str = data['due_date']
    try:
        due_date_mod = datetime.strptime(due_date_str, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        try:
            due_date_mod = datetime.strptime(due_date_str, '%Y-%m-%d %H:%M')
        except ValueError:
            return jsonify({"message": "Invalid date format. Expected YYYY-MM-DD HH:MM or YYYY-MM-DD HH:MM:SS"}), 400
        
    utc_time = due_date_mod.replace(tzinfo=timezone.utc)
    local_time = utc_time.astimezone()

    task.due_date = local_time

    assigned_user_id = data.get('assigned_user_id', None)
    if assigned_user_id:
        user = User.query.get(assigned_user_id)
        if not user:
            return jsonify({"message": "Assigned user not found"}), 404
        task.assigned_user_id = assigned_user_id

    new_status = data.get('status')
    task.status = new_status

    db.session.commit()
    return jsonify({"message": "Task updated successfully!"})



@bp.route('/tasks/<int:task_id>/status', methods=['PUT'])
@jwt_required()
def update_task_status(task_id):
    data = request.get_json()
    new_status = data.get('status')

    task = Task.query.get_or_404(task_id)
    # print(task)
    # print(new_status)

    try:
        task.status = new_status
        db.session.commit()
        return jsonify({"message": "Task status updated successfully!"}), 200
    except:
        return jsonify({"error": "You do not have permission to update this task."}), 403


    # if user.role == 'admin' or user.username == task.owner or user.id == task.assigned_user_id:
    #     # Update task status if the user has permission
    #     task.status = new_status
    #     db.session.commit()

    #     return jsonify({"message": "Task status updated successfully!"}), 200
    # else:
    #     # If the user does not have permission
    #     return jsonify({"error": "You do not have permission to update this task."}), 403
    

@bp.route('/my_task_lists', methods=['GET'])
@jwt_required()
def get_my_task_lists():
    current_username = get_jwt_identity()
    user = User.query.filter_by(username=current_username).first()

    # Admins see all task lists and tasks
    if user.role == 'admin':
        task_lists = TaskList.query.all()
    else:
        task_lists = TaskList.query.filter(
            (TaskList.owner_id == user.id) | 
            (TaskList.id.in_(
                db.session.query(Task.task_list_id)
                .filter(Task.assigned_user_id == user.id)
            ))
        ).all()

    result = []
    for task_list in task_lists:
        # For each task list, fetch tasks
        if user.role == 'admin':
            # Admins see all tasks
            tasks = Task.query.filter_by(task_list_id=task_list.id).all()
        else:
            # Non-admins only see tasks assigned to them
            tasks = Task.query.filter(
                (Task.task_list_id == task_list.id) &
                ((Task.creator_id == user.id) | (Task.assigned_user_id == user.id))
            ).all()

        # Format the task list and its tasks
        task_list_data = {
            "task_list_name": task_list.name,
            "id": task_list.id,
            "owner_id": task_list.owner_id,
            "tasks": [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "due_date": task.due_date.isoformat(),
                    "status": task.status,
                    "assigned_user_id": task.assigned_user_id
                }
                for task in tasks
            ]
        }
        result.append(task_list_data)

    return jsonify(result)
