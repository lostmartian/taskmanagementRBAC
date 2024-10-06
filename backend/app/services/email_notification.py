from flask_mail import Mail, Message
from flask import current_app

mail = Mail()


def send_email(subject, recipients, body):
    msg = Message(
        subject, sender=current_app.config['MAIL_USERNAME'], recipients=recipients)
    msg.body = body
    mail.send(msg)
