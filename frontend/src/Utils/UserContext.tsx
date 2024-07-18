import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
    username: string;
    student_id: number | null;
    teacher_id: number | null;
    setUserInfo: (info: any) => void;
    [key: string]: any;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC = ({ children }) => {
    const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
    const [student_id, setStudentId] = useState<number | null>(() => {
        const savedId = localStorage.getItem('student_id');
        return savedId ? parseInt(savedId, 10) : null;
    });
    const [teacher_id, setTeacherId] = useState<number | null>(() => {
        const savedId = localStorage.getItem('teacher_id');
        return savedId ? parseInt(savedId, 10) : null;
    });
    const [additionalInfo, setAdditionalInfo] = useState<any>(() => {
        const savedInfo = localStorage.getItem('additionalInfo');
        return savedInfo ? JSON.parse(savedInfo) : {};
    });

    const setUserInfo = (info: any) => {
        if (info.username !== undefined) {
            setUsername(info.username);
            localStorage.setItem('username', info.username);
        }
        if (info.student_id !== undefined) {
            setStudentId(info.student_id);
            localStorage.setItem('student_id', info.student_id !== null ? info.student_id.toString() : '');
        }
        if (info.teacher_id !== undefined) {
            setTeacherId(info.teacher_id);
            localStorage.setItem('teacher_id', info.teacher_id !== null ? info.teacher_id.toString() : '');
        }
        const newAdditionalInfo = { ...additionalInfo, ...info };
        setAdditionalInfo(newAdditionalInfo);
        localStorage.setItem('additionalInfo', JSON.stringify(newAdditionalInfo));
    };

    const clearUserInfo = () => {
        setUsername('');
        setStudentId(null);
        setTeacherId(null);
        setAdditionalInfo({});
        localStorage.removeItem('username');
        localStorage.removeItem('student_id');
        localStorage.removeItem('teacher_id');
        localStorage.removeItem('additionalInfo');
    };

    return (
        <UserContext.Provider value={{ username, student_id, teacher_id, setUserInfo, clearUserInfo, ...additionalInfo }}>
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
