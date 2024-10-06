from datetime import datetime, timedelta
from app.utils.extensions import mail
from flask_mail import Message
from app.utils.extensions import scheduler


def send_upcoming_task_emails():
    # Query tasks that are 30 minutes away from their deadline
    # print("hi")
    from app.models import Task, User
    now = datetime.now()
    upcoming_deadline = now + timedelta(minutes=30)

    tasks = Task.query.filter(Task.due_date.between(
        now,     upcoming_deadline), Task.status != 'Completed').all()

    print(now, upcoming_deadline, tasks)

    for task in tasks:
        assigned_user = User.query.get(task.assigned_user_id)
        if assigned_user and assigned_user.email:
            subject = f"Upcoming Task Deadline: {task.title}"
            body = f"Hello {assigned_user.username},\n\nThe task '{task.title}' is due at {
                task.due_date}. Please make sure to complete it on time."

            # Send the email
            msg = Message(subject, sender="testuserbackend2@gmail.com",
                        recipients=[assigned_user.email])
            msg.body = body
            mail.send(msg)
