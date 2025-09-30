
import STATUS from '~~/status';
import api from '../api.config';
import { useRuntimeConfig } from '#app';

export default defineNuxtPlugin(nuxtApp => {
    const router = useRouter();
    const config = useRuntimeConfig();
    nuxtApp.provide('login', async () => {
        const response = await api.get(`${config.public.API}/user/fetch`);
        if (response.status === STATUS.OK) {
            const rolePath = `/${response.data.user.activeRole.toLowerCase()}/dashboard`;
            if (response.data.user.domain === 'toggle') {
                if (response.data.user.activeRole === ROLE.SUPER_ADMIN) {
                    router.push(rolePath);
                } else {
                    window.location.href = `${config.public.AUTH}${response.data.user.domain}.${config.public.DOMAIN}`;
                }
            } else {
                router.push(rolePath);
            }
        }
    });
    nuxtApp.provide('logout', () => {
        localStorage.removeItem('_id');
        router.push('/');
    });
    nuxtApp.provide('session', () => {
        return localStorage.getItem('_id');
    });
    nuxtApp.provide('subDomain', () => {
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
    });
    nuxtApp.provide('fetchUser', async () => {
        try {
            const response = await api.get(`${config.public.API}/user/fetch`);
            if (response.status === STATUS.OK) {
                return response.data.user;
            }
            return;
        } catch (error) {
            console.log(error);
        }
    });
});
