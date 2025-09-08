<template>
    <HomeHeader />
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
                    <label for="domain">Domain</label>
                    <Field name="domain" as="input" type="text" rules="required|nospace|alphabate|min:3|max:12" />
                    <ErrorMessage name="domain" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="company.name">Company Name</label>
                    <Field name="company.name" as="input" type="text" rules="required|nospace|alphabate|min:3|max:50" />
                    <ErrorMessage name="company.name" class="text-red-500 text-sm" />
                </div>
                <div>
                    <label for="company.email">Company Email</label>
                    <Field name="company.email" as="input" type="text" rules="required|nospace|email" />
                    <ErrorMessage name="company.email" class="text-red-500 text-sm" />
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage, useForm } from 'vee-validate'
import HomeHeader from '~~/headers/Home-Header.vue'

const { handleSubmit } = useForm({});

const signup = handleSubmit((values) => {
    console.log('submitted:', values)
})
</script>
