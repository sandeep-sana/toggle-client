import { useRouter, useRoute } from 'vue-router'

export function useAuth() {

    const login = (_id) => {
        localStorage.setItem('_id', _id);
        router.push('/dashboard')
    }

    return { login }
}

export function subDomain() {
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts.length < 2) {
        return null;
    }
    const subdomain = parts[0];
    if (subdomain === process.env.DOMAIN) {
        return null;
    }
    return subdomain || null;
}
export const session = () => {
    const router = useRouter();
    const _id = localStorage.getItem('_id');
    if (!_id) {
        router.push('/');
    }
    return _id;
}

export const activeInactive = (type, value) => {
    if (type === "role") {
        if (value) {
            return "Active";
        } else {
            return "Inactive"
        }
    }
    return
}
export const logout = () => {
    const router = useRouter();
    localStorage.removeItem('_id')
    router.push('/')
}
