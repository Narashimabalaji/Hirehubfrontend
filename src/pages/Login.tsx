
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  FormControlLabel, 
  Checkbox,
  Link,
  Tabs,
  Tab,
  Alert,
  Paper
} from '@mui/material';
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [Emailid, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue:number) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
  
    if (!Emailid || !password) {
      setError('Please enter both email and password');
      return;
    }
  
    const userType = activeTab === 0 ? 'seeker' : 'hirer';
  
    try {
      const response = await fetch('https://hirehubbackend-5.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Emailid,
          password,
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('userType', data.userType); 


        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
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
              HireHub
            </Typography>
          </Box>

          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered 
            sx={{ mb: 3 }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Job Seeker" />
            <Tab label="Hiring Manager" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Emailid"
              label="Email Address"
              name="Emailid"
              autoComplete="Emailid"
              autoFocus
              value={Emailid}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <User size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    value="remember" 
                    color="primary" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
              />
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Box>
            
            <Button
              onClick={handleLogin}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 2, py: 1.5 }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Don't have an account?{' '}
                <Link href="/register" variant="body2" sx={{ fontWeight: 'medium' }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

