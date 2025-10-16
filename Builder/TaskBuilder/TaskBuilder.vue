<template>
    <pre>{{ task }}</pre>
    <Form>
        <div class="d-flex flex-wrap">
            <!-- Task Name -->
            <div class="col-lg-3 p-1">
                <label class="w-100">Task Name</label>
                <Field name="name" v-model="task.name" as="input" class="form-control input" rules="required" />
                <ErrorMessage name="name" class="text-danger small" />
            </div>

            <!-- Form -->
            <div class="col-lg-3 p-1">
                <label class="w-100">Form</label>
                <Field name="formId" v-model="task.formId" as="select" class="form-select input" rules="required">
                    <option value="">Select Form</option>
                    <option v-for="form in forms" :key="form._id" :value="form._id">{{ form.name }}</option>
                </Field>
                <ErrorMessage name="formId" class="text-danger small" />
            </div>

            <!-- Assigned To -->
            <div class="col-lg-3 p-1">
                <label class="w-100">Assigned To</label>
                <Field name="assignedTo" v-model="task.assignedTo" as="select" class="form-select input" rules="required">
                    <option value="">Select User</option>
                    <option v-for="user in users" :key="user._id" :value="user._id">{{ user.name }}</option>
                </Field>
                <ErrorMessage name="assignedTo" class="text-danger small" />
            </div>

            <!-- Start Date -->
            <div class="col-lg-3 p-1">
                <label class="w-100">Start Date</label>
                <VueDatePicker v-model="task.startDate" format="yyyy-MM-dd" :enable-time-picker="false"
                    :clearable="true" placeholder="Select Start Date" />
                <small v-if="!task.startDate && showErrors" class="text-danger">Start Date is required</small>
            </div>

            <!-- Due Date -->
            <div class="col-lg-3 p-1">
                <label class="w-100">Due Date</label>
                <VueDatePicker v-model="task.dueDate" format="yyyy-MM-dd" :enable-time-picker="false" :clearable="true"
                    placeholder="Select Due Date" />
                <small v-if="!task.dueDate && showErrors" class="text-danger">Due Date is required</small>

                <!-- Optional date comparison validation -->
                <small v-if="task.dueDate && task.startDate && new Date(task.dueDate) < new Date(task.startDate)"
                    class="text-danger">
                    Due Date cannot be earlier than Start Date
                </small>
            </div>

        </div>
    </Form>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueDatePicker from "@vuepic/vue-datepicker";
import api from "~~/api.config";
import { STATUS } from "~~/constant";

const props = defineProps({ task: Object });
const task = reactive(props.task);
const forms = ref([]);
const users = ref([]); // optional future data
const config = useRuntimeConfig();

const fetchForms = async () => {
    try {
        const { data, status } = await api.get(`${config.public.API}/form/fetchs`);
        if (status === STATUS.OK) forms.value = data.forms;
    } catch (err) {
        console.error(err);
    }
};

onMounted(fetchForms);
</script>

<style scoped>
.text-danger {
    font-size: 0.8rem;
}
</style>
