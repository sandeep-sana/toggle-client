<template>
    <div class="form">
        <div class="header">
            <div class="left">
                <h1>Forms</h1>
            </div>
            <div class="right">
                <button type="button" v-tippy="`Add Form`" @click="form.isShow = true"><i
                        class="ri-sticky-note-add-fill"></i></button>
            </div>
        </div>
        <div class="body">
            <div class="card"></div>
        </div>
    </div>
    <Modal v-if="form.isShow">
        <template #header>
            <h2 class="text-center text-xl font-bold text-primary">
                <i class="fa fa-plus-circle"></i> Add Form
            </h2>
        </template>
        <template #body>
            <form @submit.prevent="addMaster">
                <FormBuilder :form="form"/>
                <div class="d-flex justify-content-end gap-3">
                    <button type="button" @click="form.isShow = false" class="btn btn-secondary">
                        <i class="fa fa-times-circle"></i> Cancel
                    </button>
                    <button type="submit" class="btn btn-success">
                        <i class="fa fa-save"></i> Save
                    </button>
                </div>
            </form>
        </template>
    </Modal>
</template>

<script setup>
import Modal from '~~/modal/Modal.vue';
import FormBuilder from '../../../Builder/FormBuilder/FormBuilder.vue';

const form = reactive({
    isShow: false,
    blocks: [],
    name: '',
})


const addForm = () => {

}
</script>

<style scoped>
.form {
    width: 100%;
    padding: 10px;
}

.header {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    padding: 10px;
    color: var(--text-color-one);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left h1 {
    font-size: 20px;
}

.right button {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    color: var(--text-color-one);
    padding: 5px 10px;
    border-radius: 10px;
}

.right button:hover {
    background-color: var(--background-color-three);
}

.body {}
</style>