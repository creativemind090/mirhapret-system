'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy credentials for testing
const DUMMY_USERS = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user, isHydrated]);

  const login = (email: string, password: string): boolean => {
    const foundUser = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };
      setUser(userData);
      return true;
    }

    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    // Check if user already exists
    const userExists = DUMMY_USERS.some((u) => u.email === email);
    if (userExists) {
      return false;
    }

    // Add new user to dummy list
    const newUser = {
      id: String(DUMMY_USERS.length + 1),
      name,
      email,
      password,
    };
    DUMMY_USERS.push(newUser);

    // Log in the new user
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
