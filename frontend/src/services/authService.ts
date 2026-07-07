import { api } from './animalService';

export interface AdminInfo {
    id: number;
    name: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    createdAt: string;
    lastLoginAt?: string;
}

export interface AuthResponse {
    token: string;
    admin: AdminInfo;
}

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>('/auth/login', { email, password });
        return res.data;
    },

    register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
        return res.data;
    },

    listAdmins: async (): Promise<AdminInfo[]> => {
        const res = await api.get<AdminInfo[]>('/auth/admins');
        return res.data;
    },

    deleteAdmin: async (id: number): Promise<void> => {
        await api.delete(`/auth/admins/${id}`);
    },

    saveSession: (token: string, admin: AdminInfo) => {
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
    },

    clearSession: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
    },

    getAdmin: (): AdminInfo | null => {
        const raw = localStorage.getItem('admin');
        return raw ? JSON.parse(raw) : null;
    },

    isLoggedIn: (): boolean => {
        return Boolean(localStorage.getItem('token'));
    }
};
