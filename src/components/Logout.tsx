import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../store/auth';

const Logout = () => {
  const { logout } = useAuth();

  return (
    <Button variant="outlined" color="secondary" onClick={logout}>
      Logout
    </Button>
  );
};

export default Logout;
