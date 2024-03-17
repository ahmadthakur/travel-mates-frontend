import { createContext, useState, useEffect } from 'react';

// Create the user authentication context
export const UserAuthContext = createContext();

// Create a provider component for the user authentication context
export const UserAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
        }
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
    };

    return (
        <UserAuthContext.Provider value={value}>
            {children}
        </UserAuthContext.Provider>
    );
};