import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
    username: string;
    setUsername: (username: string) => void;
    [key: string]: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [username, setUsername] = useState<string>('');
    const [additionalInfo, setAdditionalInfo] = useState<any>({});

    const setUserInfo = (info: any) => {
        if (info.username) {
            setUsername(info.username);
        }
        setAdditionalInfo(info);
    };

    return (
        <UserContext.Provider value={{ username, setUsername, ...additionalInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};