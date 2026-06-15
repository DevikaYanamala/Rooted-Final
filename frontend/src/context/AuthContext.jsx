import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user] = useState({ name: 'Guest', email: 'guest@rooted.app' });

  // Auth bypassed for public demo — all users are treated as authenticated guests
  const isAuthenticated = true;

  const login = () => {};
  const logout = () => {};

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
