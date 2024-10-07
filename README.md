
# Task Management System

## Overview
This project is a task management system designed to help users create and manage task lists effectively. The system supports user authentication, role-based access control, task assignment, and status updates. Additionally, it includes a scheduler to set reminders for tasks, ensuring users can stay on top of their deadlines.

### Key Features
- User authentication and authorization (admin, owner, user roles)
- Create, edit, and delete task lists and tasks
- Assign tasks to users
- Update task status with defined options
- Scheduler for setting reminders for tasks
- Responsive UI for a better user experience

### Architecture

![Architecture flow](https://github.com/lostmartian/taskmanagementRBAC/blob/main/assets/design.png?raw=true)
### Frontend
- **React**: A JavaScript library for building user interfaces
- **Material-UI**: A React UI framework for responsive and elegant design
- **Axios**: A promise-based HTTP client for making requests to the backend
- **React Router**: For navigation between different pages

### Backend
- **Flask**: A lightweight WSGI web application framework
- **Flask-JWT-Extended**: For handling JWT (JSON Web Tokens) for user authentication
- **Flask-CORS**: For handling Cross-Origin Resource Sharing
- **SQLAlchemy**: An ORM (Object Relational Mapping) tool for interacting with the database
- **SQLite**: For the database management system

### FrontEnd and BackEnd Documentation

 1. [Frontend Doc](https://github.com/lostmartian/taskmanagementRBAC/tree/main/frontend#readme)
 2. [BackEnd Doc](https://github.com/lostmartian/taskmanagementRBAC/tree/main/backend#readme)

## Running the Project Locally  
### Prerequisites 
Ensure you have the following installed on your machine: 
- Python 3.10
- Node.js and npm 
- ### Backend Setup  
Run flask db init commands following after it only after deleting the database instance and migration folder. 
If you do not delete them then you will be able to use the users that we have created as samples.
 ```bash 
 cd backend
 python3 -m venv venv
 source venv/bin/activate
 pip3 install -r requirements.txt
 flask db init
 flask db migrate
 flask db upgrade
 flask run

 ```
- ### FrontEnd Setup
```bash 
 cd frontend
 npm install
 npm audit fix
 npm start
 ```
### Demo Users:

**Admin**
- Username: admin Password: admin

**Test users**
- Username: test2 Password: test2

- Username: test3 Password: test3

- Username: testdemo Password: testdemo