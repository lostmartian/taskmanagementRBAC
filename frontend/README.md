## Frontend Documentation for Task Management System

## Overview

This frontend application is designed for managing task lists and tasks using **React** and **Material-UI** components. The system allows users to create task lists, add tasks, edit tasks, and update task statuses. The application integrates with a **Flask** backend API, which provides authentication and data handling for tasks and users.

## Admin Register Page: 
Routes and Flow The **Admin Register** page allows administrators to register new users in the **ManageIt** task management system. The page checks if the current user has admin privileges before allowing access to the registration form.

### Route
`/admin-register`: Lets the admin users when logged in create new users for the system

### Flow
-  The component checks for admin privileges upon loading.
- If the user is an admin:
    -   The registration form is displayed.
- Admin enters details and submits the form:
    -   A POST request is sent to register the user.
    -   Success or error messages are displayed based on the response.
-  Admin can navigate back using the "Back" button.


## Login Page:
This page is the login interface for the **ManageIt** task management system. It allows users to log in by entering their username and password, and on successful login, the user is redirected to the tasks page.

### Route
`/`: This is the default route for the system and also serves as the landing page

### Flow

-  User enters username and password.
-  User clicks "Login" to submit the form.
-  The  `handleSubmit`  function sends the POST request to the backend.
-  If the login is successful:
    -   The token is stored in  `localStorage`.
    -   The user is redirected to  `/tasks`.
-  If the login fails:
    -   An error message is displayed below the form.

## Task Page flow and routes:

**API Integration**:  
The frontend interacts with the Flask backend through **Axios** to make requests. The primary routes used include:

-   `GET /my_task_lists`: Fetches task lists and tasks for the logged-in user.
-   `GET /current_user`: Retrieves current logged-in user information.
-   `POST /task_lists`: Creates a new task list.
-   `POST /task_lists/{taskListId}/tasks`: Creates a new task in the specified task list.
-   `PUT /task_lists/{taskListId}`: Updates a task list name.
-   `PUT /tasks/{taskId}`: Updates task details (title, description, due date, etc.).
-   `PUT /tasks/{taskId}/status`: Updates task status.

### Authorization
All actions require an authentication token (`Bearer token`) stored in  `localStorage`. This token is sent in headers for every request.

### Routes

-   **Main Tasks Page**:  
    After successful login, users land on this page:
    -   `/tasks`  (Default page to show task lists and tasks).
-   **Admin Registration Page**:  
    Only admins can access this page to register new users:
    -   `/admin-register`

### Flow

 -  **User Login/Register**:  
    Users start by logging in or registering a new account. The home page only allows these actions. Upon login, the token is stored in local storage, and the user is redirected to the main task page. New users can be created by the admin only once they login to the system.
    
-  **Displaying Task Lists and Tasks**:  
    Once on the tasks page, the app fetches the current user's task lists and tasks using the API. The task lists are displayed with associated tasks. Tasks can be edited or updated based on user permissions.
    
- **Task List Creation**:  
    Users can create new task lists via the "Create New Task List" button. A dialog is used to enter the task list name, and the list is submitted via API.
    
- **Adding Tasks**:  
    For each task list, users can add new tasks using the "Add Task" button. A dialog is displayed to input the task details, including title, description, due date, and status.
    
- **Editing Tasks and Status**:  
    Tasks can be edited by clicking the edit icon. A dialog opens for users to modify task details. Status updates are handled similarly, where users can choose between "Not Started," "In Progress," and "Completed."
    
- **Logout**:  
    Clicking the logout button clears the stored token and redirects the user to the login page.