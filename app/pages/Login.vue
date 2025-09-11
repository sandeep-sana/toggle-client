<template>
    <div>
        <div>left side</div>

        <div>
            <form @submit="login">
                <div>
                    <label for="email">Email</label>
                    <Field name="email" as="input" type="text" rules="required|nospace|email" />
                    <ErrorMessage name="email" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="password">Password</label>
                    <Field name="password" as="input" type="text" rules="required|nospace|min:5" />
                    <ErrorMessage name="password" class="text-red-500 text-sm" />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '~~/api.config';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import STATUS from '~~/status';
import { subDomain } from '~~/function';

const dbName = ref(null);
const router = useRouter();
const { $toast } = useNuxtApp();    
const config = useRuntimeConfig();
const { handleSubmit } = useForm({});



const login = handleSubmit(async (values) => {
    const query = {
        ...values,
    }
    try {
        const response = await api.get(`${config.public.API}/user/user`, {
            params: {
                query: JSON.stringify(query),
                dbName: dbName.value,
            }
        })
        if (response.status === STATUS.OK) {
            console.log(response)
            localStorage.setItem('_id', response.data.user._id);
            $toast.success(response.data.message);
            router.push('/dashboard');
        }
    } catch (error) {
        $toast.error(error.response.data.message);
    }
})

const init = () => {
    const domain = subDomain();
    dbName.value = domain;
}

onMounted(init);
</script>
