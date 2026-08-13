// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { LoginResponse, User } from '../types/auth.types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [token, setToken] = useState<string | null>(null);
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
//const baseUrl = 'https://lams.apin.org.ng/wastelogic';
const baseUrl = 'https://admintools.apin.org.ng/dctms/backend/public';

useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        // Validate token with backend
           /* const response = await fetch(`${baseUrl}/api/get_user_credentials_mobile.php?email=${token}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData[0]);
                setIsAuthenticated(true);
            } 
            else {
                localStorage.removeItem('authToken');
            }*/
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    } finally {
        setLoading(false);
    }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        //console.log(response.data);
        const data = await response.json();
        //console.log(data);
        data ?
        get_user_credentials(data) 
        : console.log('Invalid Login Credentials')
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const get_user_credentials = async (data: LoginResponse) => {
      try {
        /*const response = await fetch(`${baseUrl}/api/get_user_credentials_mobile.php?email=${email}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          //body: JSON.stringify({ email, password })
        });
  
        if (response.ok) {
          const data = await response.json();*/
          localStorage.setItem('authToken', data?.token);
          setToken(data?.token);
          setUser(data?.user);
          setIsAuthenticated(true);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};