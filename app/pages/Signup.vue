<template>
    <div>
        <div>left side</div>

        <div>
            <form @submit="signup">
                <div>
                    <label for="domain">Domain</label>
                    <Field name="domain" as="input" type="text" rules="required|nospace|alphabate|min:3|max:12" />
                    <ErrorMessage name="domain" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="firstName">First Name</label>
                    <Field name="firstName" as="input" type="text" rules="required|nospace|alphabate|min:3|max:50" />
                    <ErrorMessage name="firstName" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="lastName">Last Name</label>
                    <Field name="lastName" as="input" type="text" rules="required|nospace|alphabate|min:3|max:50" />
                    <ErrorMessage name="lastName" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="companyName">Company Name</label>
                    <Field name="companyName" as="input" type="text" rules="required|min:3|max:50" />
                    <ErrorMessage name="companyName" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="email">Company Email</label>
                    <Field name="email" as="input" type="text" rules="required|nospace|email" />
                    <ErrorMessage name="email" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="description">Description</label>
                    <Field name="description" as="textarea" rules="required" />
                    <ErrorMessage name="description" class="text-red-500 text-sm" />
                </div>
                <div>
                    <button type="submit" :disabled="isSubmitting">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import api from '~~/api.config';
import STATUS from '~~/status';
import { Field, ErrorMessage, useForm } from 'vee-validate';

const { $toast } = useNuxtApp();
const config = useRuntimeConfig();

const { handleSubmit, isSubmitting } = useForm({});

const signup = handleSubmit(async (values) => {
    const query = {
        ...values,
        role: "ADMIN",
    }
    try {
        const response = await api.post(`${config.public.API}/user/user`, {
            query: JSON.stringify(query),
        })
        if (response.status === STATUS.CREATED) {
            $toast.success(response.data.message);
        }
    } catch (error) {
        $toast.error(error.response.data.message);

    }
})
</script>
