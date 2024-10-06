from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from app.models import User


def role_required(role_allowed):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            current_user = User.query.filter_by(
                username=get_jwt_identity()).first()
            if current_user.role in role_allowed:
                return fn(*args, **kwargs)
            return jsonify({"message": "Access forbidden"}), 403
            # return fn(*args, **kwargs)
        return decorator
    return wrapper
