
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FileHistory } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  addHistory: (item: Omit<FileHistory, 'id' | 'timestamp'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('pdf_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.pass === pass);
    
    if (found) {
      const userData: User = { 
        id: found.id, 
        email: found.email, 
        name: found.name, 
        role: 'user', 
        history: found.history || [] 
      };
      setUser(userData);
      localStorage.setItem('pdf_user', JSON.stringify(userData));
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error("Email already registered");
    }
    
    const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, pass, history: [] };
    users.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(users));
    
    const userData: User = { id: newUser.id, email: newUser.email, name: newUser.name, role: 'user', history: [] };
    setUser(userData);
    localStorage.setItem('pdf_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pdf_user');
  };

  const addHistory = (item: Omit<FileHistory, 'id' | 'timestamp'>) => {
    if (!user) return;
    const newEntry: FileHistory = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const updatedUser = { ...user, history: [newEntry, ...user.history] };
    setUser(updatedUser);
    localStorage.setItem('pdf_user', JSON.stringify(updatedUser));
    
    // Sync with registered users store
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx].history = updatedUser.history;
      localStorage.setItem('registered_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, addHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
