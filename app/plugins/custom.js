
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
    let voices = [];
    let voicesReady = false;
    const initVoices = () => {
        return new Promise((resolve) => {
            const synth = window.speechSynthesis;
            const load = () => {
                voices = synth.getVoices();
                if (voices.length > 0) {
                    voicesReady = true;
                    resolve(voices);
                } else {
                    setTimeout(load, 200);
                }
            };
            load();
        });
    };
    if (process.client) {
        initVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            voicesReady = true;
        };
    }
    const speak = async (message, lang = "hi-IN") => {
        if (!("speechSynthesis" in window)) {
            console.warn("Speech synthesis not supported in this browser.");
            return;
        }
        if (!voicesReady) {
            await initVoices();
        }
        const synth = window.speechSynthesis;
        const selectedVoice =
            voices.find(v => v.lang === lang) ||
            voices.find(v => /Google हिन्दी/i.test(v.name)) ||
            voices[0];
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice?.lang || lang;
        utterance.rate = 1;
        utterance.pitch = 1;
        synth.cancel();
        synth.speak(utterance);
    };
    nuxtApp.provide("speak", speak);
    nuxtApp.provide("onDragStart", (event, block) => {
        event.dataTransfer.setData("application/json", JSON.stringify(block));
        event.dataTransfer.effectAllowed = "move";
    });
    nuxtApp.provide("onMouseover", (event) => {
        event.currentTarget.style.border = "1px dashed green";
    });
    nuxtApp.provide("onMouseout", (event, block, form) => {
        if (form.property && block.id === form.property.id) return;
        event.currentTarget.style.border = "1px solid var(--border-color-two)";
    });
    nuxtApp.provide("onDragover", (event) => {
        event.preventDefault();
        event.currentTarget.style.border = "1px dashed green";
    });
    nuxtApp.provide("onDragleave", (event) => {
        event.preventDefault();
        event.currentTarget.style.border = "1px solid var(--border-color-one)";
    });
    nuxtApp.provide("onDrop", (event, form) => {
        event.preventDefault();
        const block = JSON.parse(event.dataTransfer.getData("application/json"));
        let id = `${block.is}_${form.blocks.length}`;
        form.blocks.push({ ...block, id });
        speak(`${block.label} dropped`);
        event.currentTarget.style.border = "1px solid var(--border-color-one)";
    });
    nuxtApp.provide("onPropertyout", (id) => {
        document.getElementById(id).style.border = "1px solid var(--border-color-two)";
    });
});
