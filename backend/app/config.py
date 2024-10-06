import os


class Config:
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY', 'heysecretkey')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 'sqlite:///task_management.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'heyjwtsecret')

   
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'hehe@gmail.com'
    MAIL_PASSWORD = 'lolidk'
    MAIL_DEFAULT_SENDER = 'hehe@gmail.com'
