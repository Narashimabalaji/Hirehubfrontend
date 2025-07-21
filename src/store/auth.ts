import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  emailId: string | null;
  userType: string | null;
  accessToken: string | null;
  login: (
    Emailid: string,
    password: string,
    role: string,
    setError: (msg: string) => void,
    setIsLoading: (val: boolean) => void
  ) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      emailId: null,
      userType: null,
      accessToken: null,

      login: async (Emailid, password, role, setError, setIsLoading) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Emailid, password, role }),
          });

          const data = await response.json();

          if (response.ok) {
            const determinedUserType = Emailid === 'admin@hirehub.com' ? 'admin' : data.userType;

            set({
              isAuthenticated: true,
              emailId: data.Emailid,
              userType: determinedUserType,
              accessToken: data.access_token,
            });

            localStorage.setItem('refresh_token', data.refresh_token); // persist manually if needed
          } else {
            setError(data.message || 'Login failed');
          }
        } catch (err) {
          console.error(err);
          setError('Something went wrong. Please try again.');
        } finally {
          setIsLoading(false);
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          emailId: null,
          userType: null,
          accessToken: null,
        });
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');

        // optionally redirect manually (outside store)
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        emailId: state.emailId,
        userType: state.userType,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
