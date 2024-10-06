from flask import Flask
from app.utils.extensions import db, mail, jwt, scheduler
# from flask_sqlalchemy import SQLAlchemy
# from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
# from flask_mail import Mail
from flask_cors import CORS, cross_origin
# from apscheduler.schedulers.background import BackgroundScheduler
from app.utils.send_email import send_upcoming_task_emails


# scheduler = BackgroundScheduler()
# mail = Mail()
# db = SQLAlchemy()
# jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000"])
    app.config.from_object('app.config.Config')
    app.config['CORS_HEADERS'] = 'Content-Type'

    
    register_extensions(app)
    
    migrate = Migrate(app, db)

    def email_job():
        with app.app_context():
            send_upcoming_task_emails()

    # Scheduler Setup
    scheduler.add_job(email_job,
                      trigger="interval", minutes=1)  
    scheduler.start()

    # Register blueprints
    # @cross_origin
    from app.routes import tasks, task_lists, users
    app.register_blueprint(tasks.bp)
    app.register_blueprint(task_lists.bp)
    app.register_blueprint(users.bp)

    return app

def register_extensions(app):
    mail.init_app(app)
    db.init_app(app)
    jwt.init_app(app)
