<template>
  <div class="add-task" v-tippy="`Add Task`"><i class="ri-add-fill"></i></div>
  <Modal v-if="workflow.isShow">
    <template #header>
      <h2 class="text-center text-xl font-bold text-primary">
        <i class="fa fa-plus-circle"></i> Add Task
      </h2>
      <button type="button" @click="closeForm"><i class="ri-close-fill"></i></button>
    </template>
    <template #body>
      <WorkflowBuilder :workflow="workflow" />
    </template>
  </Modal>
</template>
<script setup>
import Modal from '~~/modal/Modal.vue';

const hy = reactive({
  isShow: false,
})

</script>
<style scoped>
.add-task {
  border: 1px solid var(--border-color-one);
  border-radius: 10px;
  text-align: center;
  font-size: 20px;
  background-color: var(--background-color-two);
  cursor: pointer;
}

.add-task:hover {
  background-color: var(--background-color-three);
}
</style>