import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You need to be logged in as admin to register new users.");
        navigate("/");
        return;
      }

      try {
        const res = await axios.get("http://127.0.0.1:5000/current_user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.role === "admin") {
          setIsAdmin(true);
        } else {
          alert("You need to log in as an admin to register new users.");
          navigate("/"); 
        }
      } catch (error) {
        console.error("Error checking admin status", error);
        alert("Error checking admin status.");
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/register",
        {
          username,
          password,
          email,
          role, 
        },
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );
      setMessage("User registered successfully!");
    } catch (error) {
      setMessage("Registration failed.");
    }
  };

  // Render only if the user is admin
  if (!isAdmin) {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Admin Register
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
        {message && <Typography color="success">{message}</Typography>}

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back
        </Button>

      </Box>
    </Container>
  );
};

export default AdminRegister;
