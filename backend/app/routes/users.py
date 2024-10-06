from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, db
from flask_jwt_extended import create_access_token
from flask_cors import cross_origin
from flask_jwt_extended import get_jwt_identity, jwt_required

bp = Blueprint('users', __name__)


@bp.route('/register', methods=['POST'])
# @cross_origin
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(
        data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'],
                    password=hashed_password,
                    email=data['email'], 
                    role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    user = User.query.filter_by(username=data['username']).first()
    return jsonify({"user_id": user.id, "message": "User registered successfully!"})


@bp.route('/login', methods=['POST'])
# @cross_origin
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=user.username)
        return jsonify({"id": user.id, "token": token})
    return jsonify({"message": "Invalid credentials"}), 401


@bp.route('/current_user', methods=['GET'])
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()

    # print(current_user_id)

    user = User.query.filter_by(username=current_user_id).first()

    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    })
