from flask import Blueprint, request, jsonify
from app.models import TaskList, User
from app import db
from app.utils.auth import role_required
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt_identity, jwt_required

bp = Blueprint('task_lists', __name__)


@bp.route('/task_lists', methods=['POST'])
@jwt_required()
# @cross_origin()
# @role_required(['owner', 'admin'])
def create_task_list():
    data = request.get_json()
    current_username = get_jwt_identity()
    current_user = User.query.filter_by(username=current_username).first()
    if not current_user:
        return jsonify({"message": "User not found!"}), 404
    task_list = TaskList(name=data['name'], owner=current_user)
    db.session.add(task_list)
    db.session.commit()
    return jsonify({"task_list_id": task_list.id, "message": "Task list created!"})


@bp.route('/task_lists/<int:id>', methods=['PUT'])
@jwt_required()
def update_task_list(id):
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(username=current_user_id).first()

    print(current_user_id, id)

    # Fetch the task list
    task_list = TaskList.query.get_or_404(id)

    # Check if the user is an admin or the owner of the task list
    if user.role != 'admin' and task_list.owner_id != user.id:
        return jsonify({"message": "Access forbidden. Only the owner or admin can update."}), 403

    # Update the task list details
    data = request.get_json()
    task_list.name = data['name']
    db.session.commit()

    return jsonify({"id": task_list.id, "message": "Task list updated successfully!"})
