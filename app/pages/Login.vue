<template>
    <HomeHeader />
    <div>
        <div>left side</div>

        <div>
            <form @submit="login">
                <div>
                    <label for="company.email">Email</label>
                    <Field name="company.email" as="input" type="text" rules="required|nospace|email" />
                    <ErrorMessage name="company.email" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="company.password">Password</label>
                    <Field name="company.password" as="input" type="text" rules="required|nospace|min:5" />
                    <ErrorMessage name="company.password" class="text-red-500 text-sm" />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import api from '~~/api.config';
import HomeHeader from '~~/headers/Home-Header.vue';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import STATUS from '~~/status';

const router = useRouter();
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const { handleSubmit } = useForm({});

const login = handleSubmit(async (values) => {
    const query = {
        'company.email': values['company']['email'],
        'company.password': values['company']['password'],
        role: "SUPER_ADMIN",
    }
    try {
        const response = await api.get(`${config.public.API}/super-admin/account`, {
            params: {
                query: JSON.stringify(query),
            }
        })
        if (response.status === STATUS.OK) {
            localStorage.setItem('_id', response.data.account._id);
            $toast.success(response.data.message);
            router.push('/dashboard');
        }
    } catch (error) {
        $toast.error(error.response.data.message);
    }
})
</script>
