import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TaskIcon from "@mui/icons-material/Task";
import AddIcon from "@mui/icons-material/Add";
import { green, red, orange } from "@mui/material/colors"; // Colors for task statuses

const Tasks = () => {
  const [newTaskListOpen, setNewTaskListOpen] = useState(false);
  const [newTaskListName, setNewTaskListName] = useState("");
  const [taskLists, setTaskLists] = useState([]);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false); // For new task dialog
  const [currentTask, setCurrentTask] = useState({});
  const [currentUser, setCurrentUser] = useState({}); // To hold current logged-in user info
  const [currentTaskListId, setCurrentTaskListId] = useState(null); // Track which task list is being edited
  const [editTaskListOpen, setEditTaskListOpen] = useState(false);
  const [currentTaskList, setCurrentTaskList] = useState({});
  const [editStatus, setEditStatusOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskRes = await axios.get("http://127.0.0.1:5000/my_task_lists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaskLists(taskRes.data);

        const userRes = await axios.get("http://127.0.0.1:5000/current_user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(userRes.data);
      } catch (error) {
        console.log("Error fetching tasks or user info", error);
      }
    };
    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login page
  };

  // Handle New Task List Submit
  const handleNewTaskListSubmit = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/task_lists",
        { name: newTaskListName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTaskListOpen(false); // Close the dialog
      setNewTaskListName(""); // Reset input field

      // Re-fetch task lists to reflect the new task list
      const res = await axios.get("http://127.0.0.1:5000/my_task_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskLists(res.data);
    } catch (error) {
      console.log("Error creating new task list", error);
    }
  };

  const handleNewTaskOpen = (taskListId) => {
    setCurrentTaskListId(taskListId); // Track the task list ID
    setCurrentTask({
      title: "",
      description: "",
      due_date: "",
      assigned_user_id: "", // Add assigned user if needed
      status: "Not Started", // Default status
    });
    setNewTaskOpen(true);
  };

  const handleNewTaskClose = () => {
    setNewTaskOpen(false);
  };

  const handleNewTaskSubmit = async () => {
    // Ensure due_date is a valid date object
    const dueDate = currentTask.due_date
      ? new Date(currentTask.due_date)
      : null;

    // Check if dueDate is valid
    if (!dueDate || isNaN(dueDate.getTime())) {
      console.error("Invalid due date");
      return; // Exit the function if the date is invalid
    }

    // Format the due date for submission
    const formattedDueDate = dueDate
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");

    console.log(currentTaskListId);

    try {
      await axios.post(
        `http://127.0.0.1:5000/task_lists/${currentTaskListId}/tasks`,
        {
          title: currentTask.title,
          description: currentTask.description,
          due_date: formattedDueDate,
          assigned_user_id: currentTask.assigned_user_id, // Pass user if needed
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTaskOpen(false);
      // Re-fetch task lists to reflect updates
      const res = await axios.get("http://127.0.0.1:5000/my_task_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskLists(res.data);
    } catch (error) {
      console.log("Error adding new task", error);
    }
  };

  const handleEditTaskListOpen = (taskList) => {
    console.log("new", taskList);
    setCurrentTaskList({
      id: taskList.id,
    });
    setEditTaskListOpen(true);
  };

  const handleEditTaskOpen = (task) => {
    setCurrentTask({
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status: task.status,
    });
    setEditTaskOpen(true);
  };

  const handleTaskListUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:5000/task_lists/${currentTaskList.id}`,
        { name: currentTaskList.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditTaskListOpen(false);
      console.log(currentTaskList);
      // Re-fetch task lists to reflect updates
      const res = await axios.get("http://127.0.0.1:5000/my_task_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskLists(res.data);
    } catch (error) {
      console.log("Error updating task list", error);
    }
  };

  const handleTaskUpdate = async () => {
    const dueDate = new Date(currentTask.due_date);
    const formattedDueDate = dueDate
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    try {
      await axios.put(
        `http://127.0.0.1:5000/tasks/${currentTask.id}`,
        {
          id: currentTask.id,
          title: currentTask.title,
          description: currentTask.description,
          due_date: formattedDueDate,
          status: currentTask.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditTaskOpen(false);
      // Re-fetch task lists to reflect updates
      const res = await axios.get("http://127.0.0.1:5000/my_task_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskLists(res.data);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  // Determine if the user can edit the task
  const canEditTask = (taskListOwnerId, taskStatus) => {
    if (!currentUser) return false;
    // console.log(currentUser)
    console.log("status", taskStatus);
    if (taskStatus === "Completed") return false; // Completed tasks cannot be edited
    return currentUser.role === "admin" || currentUser.id === taskListOwnerId;
  };

  const canEditTaskList = (taskList) => {
    console.log(taskList);
    console.log(currentUser.id === taskList.owner_id);
    // if (currentUser) return false;

    return currentUser.role === "admin" || currentUser.id === taskList.owner_id;
  };

  // Status Updates
  const canEditStatus = (taskStatus) => {
    if (!currentUser) return false;
    if (taskStatus === "Completed") return false;
    return true;
  };

  const handleEditStatusOpen = (task) => {
    setCurrentTask({
      id: task.id,
      status: task.status,
    });
    setEditStatusOpen(true);
  };

  const handleStatusUpdate = async () => {
    console.log("cr", currentTask);
    try {
      await axios.put(
        `http://127.0.0.1:5000/tasks/${currentTask.id}/status`,
        {
          id: currentTask.id,
          status: currentTask.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditStatusOpen(false);
      // Re-fetch task lists to reflect updates
      const res = await axios.get("http://127.0.0.1:5000/my_task_lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskLists(res.data);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Your Task Lists</Typography>
        <Button
          onClick={() => setNewTaskListOpen(true)}
          variant="contained"
          color="primary"
        >
          Create New Task List
        </Button>
        <Button onClick={handleLogout} variant="contained" color="secondary">
          Logout
        </Button>
      </Box>

      {taskLists && taskLists.length > 0 ? (
        taskLists.map((taskList) => (
          <Box key={taskList.task_list_id} sx={{ mt: 4 }}>
            <Typography variant="h5">
              {taskList.task_list_name || "Unnamed Task List"}
            </Typography>
            <IconButton
              onClick={() => handleEditTaskListOpen(taskList)}
              disabled={!canEditTaskList(taskList)}
            >
              <EditIcon />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleNewTaskOpen(taskList.id)}
            >
              Add Task
            </Button>

            {taskList.tasks && taskList.tasks.length > 0 ? (
              taskList.tasks.map((task) => (
                <Card
                  key={task.id}
                  sx={{
                    mt: 2,
                    backgroundColor:
                      task.status === "Completed"
                        ? green[200]
                        : task.status === "In Progress"
                        ? orange[200]
                        : red[200],
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography>{task.description}</Typography>
                    <Typography>
                      Due Date: {new Date(task.due_date).toLocaleString()}
                    </Typography>
                    <Typography>Status: {task.status}</Typography>
                    <IconButton
                      onClick={() => handleEditTaskOpen(task)}
                      disabled={!canEditTask(taskList.owner_id, task.status)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditStatusOpen(task)}
                      disabled={!canEditStatus(task.status)}
                    >
                      <TaskIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No tasks found</Typography>
            )}
          </Box>
        ))
      ) : (
        <Typography>No task lists available</Typography>
      )}

      {/* Dialog for creating a new task list */}
      <Dialog open={newTaskListOpen} onClose={() => setNewTaskListOpen(false)}>
        <DialogTitle>Create New Task List</DialogTitle>
        <DialogContent>
          <TextField
            label="Task List Name"
            value={newTaskListName}
            onChange={(e) => setNewTaskListName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTaskListOpen(false)}>Cancel</Button>
          <Button onClick={handleNewTaskListSubmit}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task List Dialog */}
      <Dialog
        open={editTaskListOpen}
        onClose={() => setEditTaskListOpen(false)}
      >
        <DialogTitle>Edit Task List</DialogTitle>
        <DialogContent>
          <TextField
            label="Task List Name"
            value={currentTaskList.name || ""}
            onChange={(e) =>
              setCurrentTaskList({ ...currentTaskList, name: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTaskListOpen(false)}>Cancel</Button>
          <Button onClick={handleTaskListUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editStatus} onClose={() => setEditStatusOpen(false)}>
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent>
          {/* <TextField
            label="Task Title"
            value={currentTask.title || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, title: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={currentTask.description || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Due Date"
            type="datetime-local"
            value={
              currentTask.due_date
                ? new Date(currentTask.due_date).toISOString().substring(0, 16) // Format to 'YYYY-MM-DDTHH:MM'
                : ""
            }
            onChange={(e) =>
              setCurrentTask({ ...currentTask, due_date: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          /> */}

          <TextField
            label="Status"
            select
            value={currentTask.status || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, status: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStatusOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editTaskOpen} onClose={() => setEditTaskOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            value={currentTask.title || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, title: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={currentTask.description || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Due Date"
            type="datetime-local"
            value={
              currentTask.due_date
                ? new Date(currentTask.due_date).toISOString().substring(0, 16) // Format to 'YYYY-MM-DDTHH:MM'
                : ""
            }
            onChange={(e) =>
              setCurrentTask({ ...currentTask, due_date: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="Status"
            select
            value={currentTask.status || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, status: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTaskOpen(false)}>Cancel</Button>
          <Button onClick={handleTaskUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={newTaskOpen} onClose={handleNewTaskClose}>
        <DialogTitle>New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            value={currentTask.title || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, title: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={currentTask.description || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Due Date"
            type="datetime-local"
            value={
              currentTask.due_date
                ? new Date(currentTask.due_date).toISOString().substring(0, 16) // Format to 'YYYY-MM-DDTHH:MM'
                : ""
            }
            onChange={(e) =>
              setCurrentTask({ ...currentTask, due_date: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Assigned User ID"
            value={currentTask.assigned_user_id || ""}
            onChange={(e) =>
              setCurrentTask({
                ...currentTask,
                assigned_user_id: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewTaskClose}>Cancel</Button>
          <Button onClick={handleNewTaskSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks;
