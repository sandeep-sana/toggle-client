export default defineNuxtPlugin(nuxtApp => {
    const router = useRouter();
    nuxtApp.provide('login', (_id) => {
        localStorage.setItem('_id', _id);
        router.push('/dashboard')
    });
    nuxtApp.provide('logout', () => {
        localStorage.removeItem('_id');
        router.push('/');
    });
    nuxtApp.provide('session', () => {
        const _id = localStorage.getItem('_id');
        if (!_id) {
            router.push('/');
        }
        return _id;
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
    nuxtApp.provide('activeInactive', (type, value) => {
        if (type === "role") {
            if (value) {
                return "Active";
            } else {
                return "Inactive"
            }
        }
        return
    });
});
