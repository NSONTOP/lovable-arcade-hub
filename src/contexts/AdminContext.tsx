import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  checkAdminCode: (code: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_CODE = 'adminispro';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminCode = (code: string): boolean => {
    const isValid = code === ADMIN_CODE;
    if (isValid) {
      setIsAdmin(true);
    }
    return isValid;
  };

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, checkAdminCode }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
