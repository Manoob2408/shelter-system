import { createContext, useContext, useState, ReactNode } from 'react';
import { AdminInfo, authService } from '../services/authService';

interface AuthContextType {
    admin: AdminInfo | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<AdminInfo | null>(authService.getAdmin());

    const login = async (email: string, password: string) => {
        const res = await authService.login(email, password);
        authService.saveSession(res.token, res.admin);
        setAdmin(res.admin);
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await authService.register(name, email, password);
        authService.saveSession(res.token, res.admin);
        setAdmin(res.admin);
    };

    const logout = () => {
        authService.clearSession();
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
