import React, { useState } from 'react';
import {
  Button,
  Grid,
  Card,
  Typography,
  CardContent,
  TextField,
  CircularProgress
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect} from 'react';

export default function TaskForm() {
  const [task, setTask] = useState({
    title: '',
    description: ''
  });
  const [editing, setEditing] = useState(false);

const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (editing) {
 await fetch(`http://localhost:3000/tasks/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
  
  } else {
  await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  }
setLoading(false);
navigate('/'); // Navigate to the tasks list after saving

};

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const loadTask = async (id) => {
        const response = await fetch(`http://localhost:3000/tasks/${id}`);
        const data = await response.json();
        setTask({
          title: data.title,
          description: data.description
        })
        setEditing(true);
      };
  useEffect(() => {
    if (params.id) {
      // Fetch the task data to edit
      loadTask(params.id);
    }
  }, [params.id]);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item>
        <Card
          sx={{
            width: 400,
            maxWidth: "90vw",
            mt: 5,
            backgroundColor: '#1e272e',
            padding: '1rem'
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ color: "white" }}
          >
           {
              editing ? 'Edit Task' : 'Create Task'
            }
           
          </Typography>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="filled"
                label="Write a task"
                fullWidth
                sx={{
                  margin: '.5rem 0',
                  input: {
                    color: 'white',
                  },
                  label: {
                    color: 'white',
                  },
                }}
                onChange={handleChange}
                name="title"
                value={task.title}
              />

              <TextField
                variant="filled"
                label="Write a description"
                multiline
                rows={4}
                fullWidth
                sx={{
                  margin: '.5rem 0',
                  textarea: {
                    color: 'white',
                  },
                  label: {
                    color: 'white',
                  },
                }}
                onChange={handleChange}
                name="description"
                value={task.description}
              />

              <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                {loading ? <CircularProgress 
                color="white"
                size={24} /> : 'Save'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}