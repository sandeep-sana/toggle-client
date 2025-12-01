<!-- SchemaBuilder.vue (parent layout) -->
<template>
  <div class="container-fluid py-3 py-md-4">
    <div class="row g-3">
      <!-- Left: sticky toolbox -->
      <aside class="col-12 col-lg-3">
        <div class="sticky-top" style="top: 1rem;">
          <Fields />
        </div>
      </aside>

      <!-- Center: editor canvas -->
      <main class="col-12 col-lg-6">
        <Editor :schema="schema" />
      </main>

      <!-- Right: properties panel -->
      <aside class="col-12 col-lg-3">
        <Property v-if="schema.property" :schema="schema" />
        <details class="mt-3">
          <summary class="text-muted">Schema JSON</summary>
          <pre class="bg-light p-3 rounded mt-2 mb-0">{{ schema }}</pre>
        </details>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from 'vue';
import Fields from './Fields.vue';
import Editor from './Editor.vue';
import Property from './Property.vue';
import api from '~~/api.config';
import STATUS from '~~/status';

const route = useRoute();
const config = useRuntimeConfig();
const schema = reactive({ columns: [], property: null });
const _id = computed(() => route.params._id);

watch(schema, async () => {
  const projection = { columns: schema.columns };
  await api.post(`${config.public.API}/master/update/${_id.value}`, {
    projection: JSON.stringify(projection),
  });
}, { deep: true });

const init = async () => {
  try {
    const response = await api.get(`${config.public.API}/master/fetch/${_id.value}`);
    if (response.status === STATUS.OK) {
      schema.columns = JSON.parse(JSON.stringify(response.data.master.columns || []));
    }
  } catch (e) {
    console.error(e);
  }
};
onMounted(init);
</script>
