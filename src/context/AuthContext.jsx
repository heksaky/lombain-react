import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const login = async (username, password) => {
    // Admin lokal — tidak perlu API
    if (username === 'admin' && password === '123') {
      const adminUser = { id: 0, name: 'Admin', isLocalAdmin: true };
      localStorage.setItem('token', 'admin-local-token');
      localStorage.setItem('user', JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    }
    // User biasa via API
    const res = await api.post('/login', { email: username, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/register', { name, email, password, password_confirmation });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    if (localStorage.getItem('token') !== 'admin-local-token') {
      try { await api.post('/logout'); } catch {}
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
