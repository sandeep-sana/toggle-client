<template>
    <div>
        <h5 class="m-0">Confirmation</h5>
        <p class="mb-0">{{ modal.message }}</p>
        <button class="btn btn-light" @click="modal.isConfirmation = false">Cancel</button>
        <button class="btn btn-primary" @click="modal.isConfirmation = false, modal.reject(modal._id)">Confirm</button>
    </div>
</template>

<script setup>
defineProps({
    modal: { type: Object },
})
</script>

<style scoped></style>
