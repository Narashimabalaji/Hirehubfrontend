import {
    Box,
    Container,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import NavBar from './navBar';


const AppLayout = () => {


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
            <NavBar />
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
