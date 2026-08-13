// src/components/AppLayout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavigationBar from './NavigationBar';

interface AppLayoutProps {
    children?: React.ReactNode; // ✅ Made optional with ?
  }

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Routes where NavigationBar should be hidden
  const hideNavRoutes = ['/login', '/signup', '/home'];
  const isAuthPage = hideNavRoutes.includes(location.pathname);
  
  // Only show nav if authenticated AND not on auth pages
  const shouldShowNav = isAuthenticated && !isAuthPage;
  
  return (
    <>
      {children}
      {shouldShowNav && <NavigationBar />}
    </>
  );
};

export default AppLayout;