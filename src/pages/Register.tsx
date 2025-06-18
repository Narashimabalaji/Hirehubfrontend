import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Paper,
  Link,
} from '@mui/material';
import { User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [Emailid, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('seeker'); // 'hirer' or 'seeker'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !Emailid || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://hirehubbackend-5.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          Emailid,
          password,
          userType
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful. You can now log in.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Register
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: <User size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              value={Emailid}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <Mail size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant={userType === 'seeker' ? 'contained' : 'outlined'}
                onClick={() => setUserType('seeker')}
              >
                Job Seeker
              </Button>
              <Button
                variant={userType === 'hirer' ? 'contained' : 'outlined'}
                onClick={() => setUserType('hirer')}
              >
                Hiring Manager
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 4, py: 1.5 }}
            >
              Register
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/login" variant="body2" sx={{ fontWeight: 'medium' }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
