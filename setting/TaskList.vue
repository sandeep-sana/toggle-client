<template>
  <div class="task-container">
    <h1>Task List</h1>
    <div class="task">
      <ul class="task-item">
        <li @click="$speak('aapko is task ko complete karna hoga!')">
          <p>1.</p>
          <p class="task-name">Task Name ukf kjhdskjf hksdfhskfh kjhsdfkj</p>
          <p class="pending" >
            <i v-tippy="'pending task'" class="ri-information-line"></i>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const { $speak } = useNuxtApp();

</script>


<style scoped>
.task-container {
  position: absolute;
  bottom: 5px;
  right: 5px;
  height: 300px;
  border: 1px solid var(--border-color);
  width: 300px;
  border-radius: 10px;
  background: #0c234d;
}

.task-container h1 {
  color: var(--text-color);
  font-size: 30px;
  text-align: center;
  padding: 0;
  margin: 0;
}

.task-container .task {
  border: 1px solid var(--border-color);
  width: 90%;
  height: calc(100% - 42px);
  display: flex;
  margin: auto;
  border-radius: 10px;
}

.task-item {
  color: var(--text-color);
  width: 100%;
  padding: 10px;
}

.task-item li {
  margin: 5px 0;
  padding: 0;
  border: 1px solid var(--border-color);
  list-style: none;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.task-item li .task-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 170px;
  overflow: hidden;
}

.task-item li:hover {
  background-color: var(--hover-background-color);
  color: var(--hover-color);
}

.task-icon {
  font-size: 24px; /* Adjust icon size */
  color: var(--text-color); /* Adjust color */
}
.pending{
    color: var(--pending-color);
}
</style>
