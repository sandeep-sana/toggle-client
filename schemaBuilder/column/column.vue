<template>
    <div>
        <button @click="edit">Edit</button>
    </div>
</template>
<script setup>
import { reactive } from 'vue';

const props = defineProps({
    columnKey: { type: String, required: true },
    columnValue: { type: Object, required: true },
    schema: { type: Object, required: true },
});
const schema = reactive(props.schema);
const edit = () => {
    schema.property = { [props.columnKey]: props.columnValue };
}
</script>