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
import {
    Home,
    Menu as MenuIcon,
    X as CloseIcon,
    LogOut as LogoutIcon,
    BriefcaseBusiness as BriefcaseBusinessIcon,
    User as UserIcon,
} from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

const AppLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const userType = user?.userType;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Top Navigation */}
            <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
                <Toolbar>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', flexGrow: { xs: 1, sm: 0 } }}>
                        HireHub
                    </Typography>

                    {/* Desktop Navigation */}
                    <Box sx={{ ml: 4, display: { xs: 'none', sm: 'flex' } }}>
                        <Button
                            startIcon={<Home />}
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                mr: 2,
                                color: 'text.primary',
                                borderBottom: `2px solid ${theme.palette.primary.main}`,
                                borderRadius: 0,
                                px: 1
                            }}
                        >
                            Dashboard
                        </Button>

                        {userType === 'hirer' ? (
                            <Button
                                startIcon={<BriefcaseBusinessIcon />}
                                onClick={() => navigate('/hirer')}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'text.primary',
                                        borderBottom: `2px solid ${theme.palette.grey[300]}`,
                                    },
                                    borderBottom: '2px solid transparent',
                                    borderRadius: 0,
                                    px: 1
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
                                    '&:hover': {
                                        color: 'text.primary',
                                        borderBottom: `2px solid ${theme.palette.grey[300]}`,
                                    },
                                    borderBottom: '2px solid transparent',
                                    borderRadius: 0,
                                    px: 1
                                }}
                            >
                                Saved Jobs
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Desktop User Menu */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'grey.200', color: 'text.secondary', width: 32, height: 32 }}>
                            <UserIcon size={20} />
                        </Avatar>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<LogoutIcon />}
                            size="small"
                            sx={{ ml: 2 }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>

                    {/* Mobile menu button */}
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleMobileMenu}
                        sx={{ display: { sm: 'none' } }}
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
                sx={{ display: { sm: 'none' } }}
            >
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton selected onClick={() => { navigate('/dashboard'); toggleMobileMenu(); }}>
                                <ListItemIcon>
                                    <Home color={theme.palette.primary.main} />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" primaryTypographyProps={{ color: 'primary' }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { navigate(userType === 'hirer' ? '/hirer' : '/saved'); toggleMobileMenu(); }}>
                                <ListItemIcon>
                                    <BriefcaseBusinessIcon />
                                </ListItemIcon>
                                <ListItemText primary={userType === 'hirer' ? "My Job Posts" : "Saved Jobs"} />
                            </ListItemButton>
                        </ListItem>
                    </List>

                    <Divider />

                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'grey.200', mr: 2 }}>
                                <UserIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="body1">{user?.Emailid || "User"}</Typography>
                                <Typography variant="body2" color="text.secondary">{user?.userType || "role"}</Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<LogoutIcon />}
                            fullWidth
                            onClick={() => {
                                handleLogout();
                                toggleMobileMenu();
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};

export default AppLayout;
