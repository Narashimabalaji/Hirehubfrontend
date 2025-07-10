import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import logo from '../../assets/logo.png';
import {
    Home,
    Menu as MenuIcon,
    X as CloseIcon,
    LogOut as LogoutIcon,
    BriefcaseBusiness as BriefcaseBusinessIcon,
    User as UserIcon,
} from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';

const AppLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();

    const { logout } = useAuth();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const userType = user?.userType;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Top Navigation */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(255, 255, 255, 0.95)'
                }}
            >
                <Toolbar>
                    <img
                        src={logo}
                        alt="HireHub Logo"
                        style={{ width: "140px", height: "auto" }}
                        onClick={() => navigate('/home')}
                    />

                    {/* Desktop Navigation */}
                    <Box sx={{ ml: 6, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <Button
                            startIcon={<Home />}
                            onClick={() => navigate('/home')}
                            sx={{
                                mr: 1,
                                color: 'primary.main',
                                bgcolor: 'primary.50',
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: 'primary.100',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            Home
                        </Button>

                        {userType === 'hirer' ? (
                            <Button
                                startIcon={<BriefcaseBusinessIcon />}
                                onClick={() => navigate('/hirer')}
                                sx={{
                                    color: 'text.secondary',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: 'action.hover',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                My Job Posts
                            </Button>
                        ) : (
                            <Button
                                startIcon={<BriefcaseBusinessIcon />}
                                onClick={() => navigate('/saved')}
                                sx={{
                                    color: 'text.secondary',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: 'action.hover',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                Saved Jobs
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Desktop User Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            bgcolor: 'grey.50',
                            borderRadius: 3,
                            px: 2,
                            py: 1
                        }}>
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                width: 36,
                                height: 36,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <UserIcon size={18} />
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {user?.Emailid?.split('@')[0] || "User"}
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="text"
                            color="error"
                            size="small"
                            sx={{
                                borderRadius: 2,
                                px: 0,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onClick={logout}
                        >
                            <LogoutIcon size={20} />
                        </Button>
                    </Box>

                    {/* Mobile menu button */}
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleMobileMenu}
                        sx={{
                            display: { md: 'none' },
                            color: 'text.primary',
                            '&:hover': {
                                bgcolor: 'action.hover',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
                sx={{
                    display: { md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 280,
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    }
                }}
            >
                <Box sx={{ width: 280 }} role="presentation">
                    {/* Drawer Header */}
                    <Box sx={{
                        p: 3,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'primary.50'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                width: 48,
                                height: 48,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <UserIcon size={24} />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={600} color="text.primary">
                                    {user?.Emailid?.split('@')[0] || "User"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Navigation Items */}
                    <List sx={{ px: 2, py: 2 }}>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected
                                onClick={() => { navigate('/home'); toggleMobileMenu(); }}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.50',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.100',
                                        },
                                    },
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                <ListItemIcon>
                                    <Home color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Home"
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        color: 'primary.main'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => { navigate(userType === 'hirer' ? '/hirer' : '/saved'); toggleMobileMenu(); }}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                <ListItemIcon>
                                    <BriefcaseBusinessIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={userType === 'hirer' ? "My Job Posts" : "Saved Jobs"}
                                    primaryTypographyProps={{
                                        fontWeight: 500
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>

                    {/* Logout Section */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<LogoutIcon />}
                            fullWidth
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.2)',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onClick={() => {
                                logout();
                                toggleMobileMenu();
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ py: 3 }}>
                <Container maxWidth="xl">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};

export default AppLayout;
