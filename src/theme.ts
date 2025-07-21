import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00254e',
        },
        secondary: {
            main: '#36a9e4',
        },
    },
    typography: {
        fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme;
