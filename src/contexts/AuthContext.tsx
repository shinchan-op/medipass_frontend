import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  medipassId: string | null;
  login: (medipassId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [medipassId, setMedipassId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedMedipassId = localStorage.getItem('medipassId');
    
    if (storedAuth && storedMedipassId) {
      setIsAuthenticated(true);
      setMedipassId(storedMedipassId);
    }
  }, []);

  const login = (newMedipassId: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('medipassId', newMedipassId);
    setIsAuthenticated(true);
    setMedipassId(newMedipassId);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('medipassId');
    setIsAuthenticated(false);
    setMedipassId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, medipassId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 