<template>
  <div v-for="(tool, toolIndex) in Tools" :key="toolIndex">
    <p>{{ tool.name }}</p>
    <div class="d-flex flex-wrap w-100">
      <div v-for="(list, listIndex) in tool.lists" :key="listIndex" class="col-6 border element"
        v-tippy="`${list.description}`" @dragstart="(event) => $onDragStart(event, list)" draggable="true">
        <i :class="list.icon"></i>
        <h5>{{ list.attribute.label }}</h5>
      </div>
    </div>
  </div>
</template>

<script setup>
const Tools = [
  {
    name: 'Fields',
    lists: [],
  },
  {
    name: 'Static',
    lists: [],
  },
  {
    name: 'Structures',
    lists: [
      {
        is: 'ColumnOne',
        icon: 'ri-rectangle-line',
        description: 'One columns next to each other',
        attribute: {
          label: 'Column One',
          size: 12,
        },
        style: {
          width: '',
          height: '100px',
          backgroundImage: '',
        },
      },
      // {
      //   is: 'ColumnTwo',
      //   icon: 'ri-layout-column-line',
      //   description: 'Two columns next to each other',
      //   attribute: {
      //     label: 'Column Two',
      //     size: 12,
      //   },
      //   style: {
      //   },
      // },
      // {
      //   is: 'ColumnThree',
      //   icon: 'ri-kanban-view-2',
      //   description: 'Three columns next to each other',
      //   attribute: {
      //     label: 'Column Three',
      //     size: 12,
      //   },
      //   style: {
      //   },
      // },

    ],
  }
]
</script>

<style scoped>
.element {
  text-align: center;
  cursor: pointer;
}

.element i {
  font-size: 60px;
}
</style>
