import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import type { User } from '../types';


interface AuthContextType {
user: User | null;
login: (nickName: string, password: string) => Promise<void>;
register: (nickName: string) => Promise<User>;
logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


const STORAGE_KEY = 'uasn:user';


export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);


useEffect(() => {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) setUser(JSON.parse(raw));
}, []);


const login = async (nickName: string, password: string) => {
if (password !== '123456') throw new Error('Contraseña inválida');


const users = await api.getUsers();
const found = users.find((u) => u.nickName.toLowerCase() === nickName.toLowerCase());
if (!found) throw new Error('Usuario no encontrado');


setUser(found);
localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
};


const register = async (nickName: string) => {
const created = await api.createUser({ nickName });
return created;
};


const logout = () => {
setUser(null);
localStorage.removeItem(STORAGE_KEY);
};


const value = useMemo(() => ({ user, login, register, logout }), [user]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error('useAuth must be used within AuthProvider');
return ctx;
}