<template>
  <div>
    <form @submit="submit">
      <h5 class="m-0">{{ modal.header }}</h5>

      <div v-for="field in modal.fields" :key="field.name" class="mb-3">
        <label :for="field.name">{{ field.label }}</label>
        <Field
          :name="field.name"
          :as="field.as || 'input'"
          :type="field.type"
          class="form-control"
          :rules="field.rules"
          :placeholder="field.placeholder"
        />
        <ErrorMessage :name="field.name" class="text-danger small" />
      </div>

      <div class="d-flex justify-content-end">
        <button
          class="btn btn-light me-2"
          type="button"
          @click="modal.isConfirmation = false"
        >
          Cancel
        </button>
        <button class="btn btn-primary" type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { Field, ErrorMessage, useForm } from "vee-validate"
import { computed } from "vue"

const props = defineProps({
  modal: { type: Object, required: true },
})

// build initial values from modal.fields
const initialValues = computed(() => {
  const values = {}
  props.modal.fields?.forEach((f) => {
    values[f.name] = f.value ?? "" // default to empty if not provided
  })
  return values
})

const { handleSubmit, resetForm } = useForm({
  initialValues: initialValues.value,
})

// reset when modal fields change (editRole vs addRole)
watch(initialValues, (newValues) => {
  resetForm({ values: newValues })
})

const submit = handleSubmit(async (values) => {
  props.modal.isConfirmation = false
  if (typeof props.modal.save === "function") {
    props.modal.save({ ...values, _id: props.modal._id ?? null })
  }
})
</script>
