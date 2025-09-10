import { useRouter, useRoute } from 'vue-router'

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
        return _id;
    }
    const login = (_id) => {
        localStorage.setItem('_id', _id);
        router.push('/dashboard')
    }

    return { logout, session, login }
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

