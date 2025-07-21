import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import { User, Mail, Lock, Eye, EyeOff, Users, Shield, Briefcase, UserCheck } from 'lucide-react';
import logo from '../assets/logo.png';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { registerUserAPI } from '../api/authApi';

const Register = () => {
  const [name, setName] = useState('');
  const [Emailid, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('seeker');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!name || !Emailid || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      await registerUserAPI({ name, Emailid, password, userType });
      setSuccess('Registration successful. You can now log in.');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Illustration Component
  const RegisterIllustration = () => (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 400
    }}>
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill={`url(#gradient1)`}
          opacity="0.1"
        />

        {/* Person 1 */}
        <circle cx="120" cy="80" r="25" fill={theme.palette.primary.main} opacity="0.8" />
        <rect x="100" y="100" width="40" height="60" rx="20" fill={theme.palette.primary.main} opacity="0.6" />

        {/* Person 2 */}
        <circle cx="180" cy="80" r="25" fill={theme.palette.secondary.main} opacity="0.8" />
        <rect x="160" y="100" width="40" height="60" rx="20" fill={theme.palette.secondary.main} opacity="0.6" />

        {/* Handshake/Connection */}
        <path
          d="M140 120 L160 120"
          stroke={theme.palette.primary.main}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Building/Company */}
        <rect x="110" y="180" width="80" height="60" fill={theme.palette.grey[300]} opacity="0.7" />
        <rect x="120" y="190" width="15" height="15" fill={theme.palette.primary.main} opacity="0.5" />
        <rect x="135" y="190" width="15" height="15" fill={theme.palette.secondary.main} opacity="0.5" />
        <rect x="155" y="190" width="15" height="15" fill={theme.palette.primary.main} opacity="0.5" />
        <rect x="170" y="190" width="15" height="15" fill={theme.palette.secondary.main} opacity="0.5" />

        {/* Briefcase */}
        <rect x="130" y="250" width="40" height="25" rx="5" fill={theme.palette.primary.main} opacity="0.7" />
        <rect x="145" y="245" width="10" height="5" fill={theme.palette.primary.dark} />

        {/* Floating Elements */}
        <circle cx="70" cy="100" r="3" fill={theme.palette.primary.main} opacity="0.6" />
        <circle cx="230" cy="120" r="4" fill={theme.palette.secondary.main} opacity="0.6" />
        <circle cx="80" cy="180" r="2" fill={theme.palette.primary.main} opacity="0.8" />
        <circle cx="220" cy="180" r="3" fill={theme.palette.secondary.main} opacity="0.7" />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.primary.main} />
            <stop offset="100%" stopColor={theme.palette.secondary.main} />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Logo at top left */}
      <Box sx={{
        position: 'absolute',
        top: 2,
        left: 24,
        zIndex: 10
      }}>
        <img
          src={logo}
          alt="HireHub Logo"
          style={{
            width: "170px",
            height: "auto",
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '95vh',
          py: 4
        }}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              overflow: 'hidden',
              width: '100%',
              maxWidth: 900
            }}
          >
            <Grid container spacing={2} direction="row">
              {/* Left Side - Illustration */}
              <Grid size={{ xs: 12, md: 5 }} sx={{
                display: { xs: 'none', md: 'flex' },
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                alignItems: 'center',
                justifyContent: 'center',
                p: 4
              }}>
                <Box>
                  <RegisterIllustration />
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 1
                    }}>
                      Join HireHub Today
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: 'text.secondary',
                      maxWidth: 250,
                      mx: 'auto',
                      lineHeight: 1.6
                    }}>
                      Connect with opportunities or find the perfect candidate for your team
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right Side - Form */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  {/* Register Header */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'left',
                        mb: 1
                      }}
                    >
                      Create Account
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary'
                      }}
                    >
                      Join our community of job seekers and employers
                    </Typography>
                  </Box>

                  {/* Alerts */}
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          fontSize: '1.2rem'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          fontSize: '1.2rem'
                        }
                      }}
                    >
                      {success}
                    </Alert>
                  )}

                  {/* Registration Form */}
                  <Box component="form" onSubmit={handleRegister}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            }
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={20} style={{ color: theme.palette.text.secondary }} />
                          </InputAdornment>
                        )
                      }}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={Emailid}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            }
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} style={{ color: theme.palette.text.secondary }} />
                          </InputAdornment>
                        )
                      }}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            }
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={20} style={{ color: theme.palette.text.secondary }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                              sx={{
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                  background: alpha(theme.palette.primary.main, 0.1)
                                }
                              }}
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    {/* User Type Selection */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{
                        color: 'text.secondary',
                        mb: 1.5,
                        fontWeight: 500
                      }}>
                        I want to:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                          variant={userType === 'seeker' ? 'contained' : 'outlined'}
                          onClick={() => setUserType('seeker')}
                          startIcon={<UserCheck size={18} />}
                          sx={{
                            flex: 1,
                            minWidth: 140,
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            ...(userType === 'seeker' && {
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              '&:hover': {
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                              }
                            })
                          }}
                        >
                          Find Jobs
                        </Button>
                        <Button
                          variant={userType === 'hirer' ? 'contained' : 'outlined'}
                          onClick={() => setUserType('hirer')}
                          startIcon={<Briefcase size={18} />}
                          sx={{
                            flex: 1,
                            minWidth: 140,
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            ...(userType === 'hirer' && {
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              '&:hover': {
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                              }
                            })
                          }}
                        >
                          Hire Talent
                        </Button>
                      </Box>
                    </Box>

                    {/* Register Button */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        mb: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                        },
                        '&:disabled': {
                          background: theme.palette.action.disabled,
                          boxShadow: 'none',
                          transform: 'none'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    {/* Login Link */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Already have an account?{' '}
                        <Link
                          component={RouterLink}
                          to="/login"
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: theme.palette.primary.dark,
                            }
                          }}
                        >
                          Sign In
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;