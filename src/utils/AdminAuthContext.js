import { createContext, useState, useEffect } from 'react';

// Create the admin authentication context
export const AdminAuthContext = createContext();

// Create a provider component for the admin authentication context
export const AdminAuthProvider = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    useEffect(() => {
        const savedAdmin = sessionStorage.getItem("admin");
        if (savedAdmin) {
            setIsAdminAuthenticated(true);
        }
        else {
            setIsAdminAuthenticated(false);
        }
    }, []);

    const value = {
        isAdminAuthenticated,
        setIsAdminAuthenticated,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};