'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../service/axios';
import { showError } from '@/app/common/notification';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface JwtPayload{
  sub: string;
  email: string;
  role: string;
}

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  isClient: boolean;
  isTechnician: boolean;
  role: string | null;
  loading: boolean;
  refreshUser: () => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  isAdmin: false,
  isClient: false,
  isTechnician: false,
  role: null,
  loading: true,
  refreshUser: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = getCookie('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decode = jwtDecode<JwtPayload>(token.toString());
      const jwtRole = decode.role;

      setIsAdmin(jwtRole === 'ADMIN');
      setIsClient(jwtRole === 'CLIENT');
      setIsTechnician(jwtRole === 'TECHNICIAN');
      setRole(jwtRole);

      const res = await api.get('/auth/me');
      const userData = res.data.user || res.data;

      setUser({
        id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value: AppContextType = {
    user,
    isAdmin,
    isClient,
    isTechnician,
    role,
    loading,
    refreshUser: fetchUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
