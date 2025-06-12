import { writable } from 'svelte/store';
import { getSession, setSession, clearSession } from './session';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
    username?: string | null; // Add username property
    role?: string | null; // Add role property
}

interface Session {
    user: User | null;
    expires: string | null;
}

const initialSession: Session = getSession() || { user: null, expires: null };

export const session = writable<Session>(initialSession);

session.subscribe(($session) => {
    if ($session.user) {
        setSession($session);
    } else {
        clearSession();
    }
});

export function signOut() {
    session.set({ user: null, expires: null });
}