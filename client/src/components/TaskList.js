import React from 'react'
import {useEffect, useState} from 'react'; 
import { Card, CardContent, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete =  async (id) => {
   await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
    });
    loadTasks();
  };

  


  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box color="error.text" textAlign="center" py={4}>
        <Typography variant="h6">Error loading tasks</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box px={3} py={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Task List
      </Typography>
      {tasks.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="text.secondary">
            No tasks found. Add a new task to get started!
          </Typography>
        </Box>
      ) : (
        <Box>
          {tasks.map(task => (
            <Card 
              key={task.id} 
              sx={{
                marginBottom: 2,
                boxShadow: 3,
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent
               sx={{ p: 3 }}
               style={{ 
                display: 'flex',
                justifyContent: 'space-between',

               }}
               
               >
                <div style={{ color: 'primary.main', marginRight: '16px' }}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description || 'No description'}
                  </Typography>
                </div>

            
                <div>
                <Button variant="contained" color="inherit" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                  Edit
                  
                </Button>
                 <Button variant="contained" color="warning" size="small" sx={{ mt: 2 }} onClick={() => handleDelete(task.id)}>
                  Delete
                </Button>
                </div>
              
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}