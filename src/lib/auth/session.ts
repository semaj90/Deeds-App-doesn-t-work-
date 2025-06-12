import { browser } from '$app/environment';

const SESSION_KEY = 'auth_session';

export function getSession() {
    if (browser) {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }
    return null;
}

export function setSession(session: any) {
    if (browser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
}

export function clearSession() {
    if (browser) {
        localStorage.removeItem(SESSION_KEY);
    }
}