
# Task Management API

This API is designed to manage tasks and task lists. It includes endpoints for user registration, login, task management, and more.

## Authentication
All the endpoints, except for user registration and login, require JWT-based authentication. 

## API Endpoints

### Register a New User
**Endpoint**: `/register`  
**Method**: `POST`  
**Description**: Registers a new user with a username, password, email, and role.  
**Request Body**:
```json
{
    "username": "string",
    "password": "string",
    "email": "string",
    "role": "string"  # Can be 'owner', 'admin', etc.
}
```
**Response**:
```json
`{
    "user_id": "int",
    "message": "User registered successfully!"
}`
```
### Login

**Endpoint**:  `/login`  
**Method**:  `POST`  
**Description**: Logs in a user and returns a JWT token.  
**Request Body**:
```json
`{
    "username": "string",
    "password": "string"
}` 
```

**Response**:
```json
`{
    "id": "int",
    "token": "string"
}` 
```

### Get Current User Information

**Endpoint**:  `/current_user`  
**Method**:  `GET`  
**Description**: Retrieves the information of the currently logged-in user.  
**Response**:
```json
`{
    "id": "int",
    "username": "string",
    "email": "string",
    "role": "string"
}` 
```

### Create a New Task List

**Endpoint**:  `/task_lists`  
**Method**:  `POST`  
**Description**: Creates a new task list for the logged-in user.  
**Request Body**:
```json
`{
    "name": "string"
}` 
```

**Response**:
```json
`{
    "task_list_id": "int",
    "message": "Task list created!"
}` 
```

### Update a Task List

**Endpoint**:  `/task_lists/{id}`  
**Method**:  `PUT`  
**Description**: Updates an existing task list. Only the owner or an admin can update a task list.  
**Request Body**:
```json
`{
    "name": "string"
}` 
```

**Response**:
```json
`{
    "id": "int",
    "message": "Task list updated successfully!"
}` 
```

### Get User's Task Lists

**Endpoint**:  `/my_task_lists`  
**Method**:  `GET`  
**Description**: Retrieves the task lists owned or assigned to the logged-in user.  
**Response**:
```json
`[
    {
        "task_list_name": "string",
        "id": "int",
        "owner_id": "int",
        "tasks": [
            {
                "id": "int",
                "title": "string",
                "description": "string",
                "due_date": "string (ISO 8601 format)",
                "status": "string",
                "assigned_user_id": "int"
            }
        ]
    }
]` 
```

### Add a New Task

**Endpoint**:  `/task_lists/{id}/tasks`  
**Method**:  `POST`  
**Description**: Adds a new task to a specific task list.  
**Request Body**:
```json
`{
    "title": "string",
    "description": "string",
    "due_date": "string (YYYY-MM-DD HH:MM or YYYY-MM-DD HH:MM:SS)",
    "assigned_user_id": "int"
}` 
```

**Response**:
```json
`{
    "message": "Task created successfully!",
    "task_id": "int"
}` 
```

### Update a Task

**Endpoint**:  `/tasks/{task_id}`  
**Method**:  `PUT`  
**Description**: Updates a specific task. Only the task list owner or an admin can update the task.  
**Request Body**:
```json
`{
    "title": "string",
    "description": "string",
    "due_date": "string (YYYY-MM-DD HH:MM or YYYY-MM-DD HH:MM:SS)",
    "assigned_user_id": "int",
    "status": "string"
}` 
```

**Response**:
```json
`{
    "message": "Task updated successfully!"
}` 
```

### Update Task Status

**Endpoint**:  `/tasks/{task_id}/status`  
**Method**:  `PUT`  
**Description**: Updates the status of a specific task.  
**Request Body**:
```json
`{
    "status": "string"
}` 
```
**Response**:
```json
`{
    "message": "Task status updated successfully!"
}` 
```
----------
## Error Codes

-   `400 Bad Request`: Invalid data or format.
-   `401 Unauthorized`: Authentication is required.
-   `403 Forbidden`: User does not have the necessary permissions.
-   `404 Not Found`: Resource not found.