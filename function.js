import { useRouter } from 'vue-router'

export function useAuth() {
    const router = useRouter()

    const logout = () => {
        localStorage.removeItem('_id')
        router.push('/')
    }
    const session = () => {
        const _id = localStorage.getItem('_id');
        if (!_id) {
            router.push('/login');
        }
    }
    const login = (_id) => {
        localStorage.setItem('_id', _id);
        router.push('/dashboard')
    }

    return { logout, session, login }
}
