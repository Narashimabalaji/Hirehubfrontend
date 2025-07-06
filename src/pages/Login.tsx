// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   TextField,
//   Button,
//   FormControlLabel,
//   Checkbox,
//   Link,
//   Tabs,
//   Tab,
//   Alert,
//   Paper,
//   IconButton,
//   InputAdornment,
//   Divider,
//   useTheme,
//   alpha
// } from '@mui/material';
// import { User, Lock, Eye, EyeOff, Shield, Users } from 'lucide-react';
// import logo from '../assets/logo.png'; 
// import { useNavigate, Link as RouterLink } from 'react-router-dom';

// const Login = () => {
//   const [Emailid, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [activeTab, setActiveTab] = useState(0);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const theme = useTheme();

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
//     setError('');
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     if (!Emailid || !password) {
//       setError('Please enter both email and password');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('https://hirehubbackend-5.onrender.com/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ Emailid, password })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('access_token', data.access_token);
//         localStorage.setItem('refresh_token', data.refresh_token);

//         // ✅ Override userType to 'admin' for this specific email
//         const userType = Emailid === 'admin@hirehub.com' ? 'admin' : data.userType;
//         localStorage.setItem('userType', userType);

//         navigate('/home');
//       } else {
//         setError(data.message || 'Login failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Something went wrong. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const tabStyles = {
//     '& .MuiTab-root': {
//       minWidth: 120,
//       textTransform: 'none',
//       fontSize: '1rem',
//       fontWeight: 500,
//       '&.Mui-selected': {
//         color: theme.palette.primary.main,
//       }
//     },
//     '& .MuiTabs-indicator': {
//       height: 3,
//       borderRadius: 1.5,
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ mt: { xs: 4, sm: 8 }, mb: 4 }}>
//         <Paper 
//           elevation={8} 
//           sx={{ 
//             p: { xs: 3, sm: 4 },
//             borderRadius: 3,
//             background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
//             backdropFilter: 'blur(10px)',
//             border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
//           }}
//         >
//           {/* Logo Section */}
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'center', 
//             mb: 1,
//             position: 'relative'
//           }}>
//             <Box sx={{ 
//               borderRadius: 2,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}>
//               <img
//                 src={logo}
//                 alt="HireHub Logo"
//                 style={{ 
//                   width: "180px",
//                   height: "auto",
//                   filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
//                 }}
//               />
//             </Box>
//           </Box>

//           {/* Welcome Text */}
//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <Typography 
//               variant="h4" 
//               component="h1" 
//               sx={{ 
//                 fontWeight: 700,
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 mb: 1
//               }}
//             >
//               Welcome Back
//             </Typography>
//             <Typography 
//               variant="body1" 
//               sx={{ 
//                 color: 'text.secondary',
//                 fontSize: '1.1rem'
//               }}
//             >
//               Sign in to your account
//             </Typography>
//           </Box>

//           {/* Enhanced Tabs */}
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             centered
//             sx={{ 
//               mb: 4,
//               ...tabStyles,
//               '& .MuiTabs-flexContainer': {
//                 gap: 2
//               }
//             }}
//             indicatorColor="primary"
//             textColor="primary"
//           >
//             <Tab 
//               icon={<Users size={20} />} 
//               iconPosition="start"
//               label="Job Seeker" 
//               sx={{ 
//                 borderRadius: 2,
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   background: alpha(theme.palette.primary.main, 0.05)
//                 }
//               }}
//             />
//             <Tab 
//               icon={<Shield size={20} />} 
//               iconPosition="start"
//               label="Hiring Manager" 
//               sx={{ 
//                 borderRadius: 2,
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   background: alpha(theme.palette.primary.main, 0.05)
//                 }
//               }}
//             />
//           </Tabs>

//           <Divider sx={{ mb: 3, opacity: 0.3 }} />

//           {/* Error Alert */}
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 mb: 3,
//                 borderRadius: 2,
//                 '& .MuiAlert-icon': {
//                   fontSize: '1.2rem'
//                 }
//               }}
//             >
//               {error}
//             </Alert>
//           )}

//           {/* Login Form */}
//           <Box component="form" onSubmit={handleLogin}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="Emailid"
//               label="Email Address"
//               name="Emailid"
//               autoComplete="email"
//               autoFocus
//               value={Emailid}
//               onChange={(e) => setEmail(e.target.value)}
//               sx={{ 
//                 mb: 2,
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2,
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: theme.palette.primary.main,
//                     }
//                   }
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <User size={20} style={{ color: theme.palette.text.secondary }} />
//                   </InputAdornment>
//                 )
//               }}
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               autoComplete="current-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               sx={{ 
//                 mb: 2,
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2,
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: theme.palette.primary.main,
//                     }
//                   }
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Lock size={20} style={{ color: theme.palette.text.secondary }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       edge="end"
//                       sx={{ 
//                         color: theme.palette.text.secondary,
//                         '&:hover': {
//                           color: theme.palette.primary.main,
//                           background: alpha(theme.palette.primary.main, 0.1)
//                         }
//                       }}
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />

//             {/* Remember Me & Forgot Password */}
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center', 
//               mb: 3,
//               flexWrap: 'wrap',
//               gap: 1
//             }}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     value="remember"
//                     color="primary"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     sx={{
//                       '&.Mui-checked': {
//                         color: theme.palette.primary.main,
//                       }
//                     }}
//                   />
//                 }
//                 label={
//                   <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                     Remember me
//                   </Typography>
//                 }
//               />
//               <Link 
//                 href="#" 
//                 variant="body2"
//                 sx={{
//                   color: theme.palette.primary.main,
//                   textDecoration: 'none',
//                   fontWeight: 500,
//                   '&:hover': {
//                     textDecoration: 'underline',
//                     color: theme.palette.primary.dark,
//                   }
//                 }}
//               >
//                 Forgot password?
//               </Link>
//             </Box>

//             {/* Sign In Button */}
//             <Button 
//               type="submit" 
//               fullWidth 
//               variant="contained" 
//               disabled={isLoading}
//               sx={{ 
//                 mb: 3, 
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontSize: '1.1rem',
//                 fontWeight: 600,
//                 textTransform: 'none',
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                 boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
//                 '&:hover': {
//                   transform: 'translateY(-2px)',
//                   boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
//                   background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
//                 },
//                 '&:disabled': {
//                   background: theme.palette.action.disabled,
//                   boxShadow: 'none',
//                   transform: 'none'
//                 },
//                 transition: 'all 0.3s ease'
//               }}
//             >
//               {isLoading ? 'Signing In...' : 'Sign In'}
//             </Button>

//             {/* Sign Up Link */}
//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                 Don't have an account?{' '}
//                 <Link 
//                   component={RouterLink} 
//                   to="/register" 
//                   variant="body2" 
//                   sx={{ 
//                     fontWeight: 600,
//                     color: theme.palette.primary.main,
//                     textDecoration: 'none',
//                     '&:hover': {
//                       textDecoration: 'underline',
//                       color: theme.palette.primary.dark,
//                     }
//                   }}
//                 >
//                   Sign Up
//                 </Link>
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Tabs,
  Tab,
  Alert,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { User, Lock, Eye, EyeOff, Shield, Users } from 'lucide-react';
import logo from '../assets/logo.png'; 
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [Emailid, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!Emailid || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://hirehubbackend-5.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Emailid, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('Emailid', data.Emailid);

        // ✅ Override userType to 'admin' for this specific email
        const userType = Emailid === 'admin@hirehub.com' ? 'admin' : data.userType;
        localStorage.setItem('userType', userType);

        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabStyles = {
    '& .MuiTab-root': {
      minWidth: 120,
      textTransform: 'none',
      fontSize: '1rem',
      fontWeight: 500,
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      }
    },
    '& .MuiTabs-indicator': {
      height: 3,
      borderRadius: 1.5,
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Logo at top left */}
      <Box sx={{ 
        position: 'absolute',
        top: 1,
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

      {/* Centered form container */}
      <Container maxWidth="xs">
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90vh',
          py: 4
        }}>
          <Paper 
            elevation={8} 
            sx={{ 
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              width: '100%',
              maxWidth: 400
            }}
          >
            {/* Sign In Text */}
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  textAlign: 'left'
                }}
              >
                Sign In
              </Typography>
            </Box>

          {/* Enhanced Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ 
              mb: 0.5,
              ...tabStyles,
              '& .MuiTabs-flexContainer': {
                gap: 2
              }
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              icon={<Users size={20} />} 
              iconPosition="start"
              label="Job Seeker" 
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            />
            <Tab 
              icon={<Shield size={20} />} 
              iconPosition="start"
              label="Hiring Manager" 
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            />
          </Tabs>

          <Divider sx={{ mb: 3, opacity: 0.3 }} />

          {/* Error Alert */}
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

          {/* Login Form */}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Emailid"
              label="Email Address"
              name="Emailid"
              autoComplete="email"
              autoFocus
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
                    <User size={20} style={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me & Forgot Password */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              flexWrap: 'wrap',
              gap: 1
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Remember me
                  </Typography>
                }
              />
              <Link 
                href="#" 
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                    color: theme.palette.primary.dark,
                  }
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Sign In Button */}
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
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
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
    </Box>
  );
};

export default Login;