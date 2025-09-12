<template>
    <div>
        <h1>Table</h1>

        <!-- Vee-validate form -->
        <form @submit="onSubmit">
            <div class="mb-3">
                <label for="name" class="block font-medium mb-1">Name</label>
                <Field name="name" as="input" type="text" class="form-control border rounded px-3 py-2 w-full" id="name"
                    placeholder="Enter name" rules="required|nospace|min:5" />
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
            </div>

            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded" :disabled="isSubmitting">
                Save
            </button>
        </form>
    </div>
</template>

<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { Field, ErrorMessage, useForm } from "vee-validate";

const route = useRoute();
const config = useRuntimeConfig();
const _id = computed(() => route.params._id);

// Vee-validate form context
const { handleSubmit, isSubmitting, setValues } = useForm();

// Fetch data and set form values
const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/master/fetch/${_id.value}`);
        if (response.status === STATUS.OK) {
            setValues({ ...response.data.master });
        }
    } catch (error) {
        console.log(error);
    }
};
onMounted(init);

// Submit handler
const onSubmit = handleSubmit(async (values) => {
    try {
        const response = await api.post(`${config.public.API}/master/update/${_id.value}`, values);
        if (response.status === STATUS.OK) {
            console.log("Saved successfully:", response.data);
        }
    } catch (error) {
        console.error(error);
    }
});
</script>
