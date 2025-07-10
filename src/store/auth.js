import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

 const login = async( Emailid, password, role, setError, setIsLoading ) => {
       try {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({ Emailid, password, role })
         });
   
         const data = await response.json();
   
         if (response.ok) {
           localStorage.setItem('access_token', data.access_token);
           localStorage.setItem('refresh_token', data.refresh_token);
           localStorage.setItem('Emailid', data.Emailid);
   
           const userType = Emailid === 'admin@hirehub.com' ? 'admin' : data.userType;
           localStorage.setItem('userType', userType);

           setIsAuthenticated(true);
   
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

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('Emailid');
    localStorage.removeItem('userType');

    setIsAuthenticated(false);
    
    navigate('/login');
    
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
