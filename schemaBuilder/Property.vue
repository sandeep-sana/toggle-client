<!-- Property.vue -->
<template>
  <div class="card shadow-sm">
    <div class="card-header bg-light fw-semibold d-flex justify-content-between align-items-center">
      <span>Properties</span>
      <button type="button" class="btn btn-sm btn-outline-secondary" @click="closeProperty">
        Close
      </button>
    </div>

    <div class="card-body">
      <form @submit.prevent="saveGeneral">
        <div class="mb-3">
          <label for="columnName" class="form-label">Column Name</label>
          <Field
            name="columnName"
            rules="required"
            as="input"
            type="text"
            v-model="form.columnName"
            id="columnName"
            class="form-control"
            :class="{ 'is-invalid': errors.columnName }"
          />
          <ErrorMessage name="columnName" class="invalid-feedback d-block" />
        </div>

        <div class="mb-3">
          <label for="type" class="form-label">Data Type</label>
          <Field
            name="type"
            rules="required"
            as="select"
            v-model="form.type"
            id="type"
            class="form-select"
            @change="handleTypeChange"
          >
            <option value="" disabled>Select Data Type</option>
            <option v-for="t in DATA_TYPE" :key="t.value" :value="t.value">{{ t.label }}</option>
          </Field>
          <ErrorMessage name="type" class="invalid-feedback d-block" />
        </div>

        <!-- Default per type -->
        <div class="mb-3" v-if="form.type === 'NUMBER'">
          <label for="defaultNumber" class="form-label">Default</label>
          <Field name="defaultNumber" as="input" type="number" v-model="form.default" id="defaultNumber" class="form-control" @change="syncDefaultEnum" />
        </div>
        <div class="mb-3" v-else-if="form.type === 'BOOLEAN'">
          <label for="defaultBoolean" class="form-label">Default</label>
          <Field name="defaultBoolean" as="select" v-model="form.default" id="defaultBoolean" class="form-select" @change="syncDefaultEnum">
            <option v-for="b in BOOLEAN" :key="b.value" :value="b.value">{{ b.label }}</option>
          </Field>
        </div>
        <div class="mb-3" v-else>
          <label for="defaultText" class="form-label">Default</label>
          <Field name="defaultText" as="input" type="text" v-model="form.default" id="defaultText" class="form-control" @change="syncDefaultEnum" />
        </div>

        <!-- Enum -->
        <div class="mb-3">
          <label class="form-label">Enum</label>
          <Multiselect
            v-model="form.enum"
            :options="[]"
            :multiple="true"
            :close-on-select="false"
            placeholder="Add or pick values"
            :taggable="true"
            @tag="addTag"
            @remove="ensureDefaultInEnum"
          />
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-primary">
            Save
          </button>
        </div>
      </form>

      <!-- Array children manager -->
      <div class="mt-4" v-if="form.type === 'ARRAY'">
        <div class="accordion" id="arrayAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header" id="arrayHeading">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#arrayCollapse" aria-expanded="true" aria-controls="arrayCollapse">
                Array items
              </button>
            </h2>
            <div id="arrayCollapse" class="accordion-collapse collapse show" aria-labelledby="arrayHeading" data-bs-parent="#arrayAccordion">
              <div class="accordion-body">
                <div class="d-flex justify-content-end mb-3">
                  <button class="btn btn-outline-primary btn-sm" @click="addChild">
                    <i class="fa fa-plus me-1"></i> Add item
                  </button>
                </div>

                <ul class="list-group">
                  <li
                    v-for="(child, idx) in form.children"
                    :key="child.id || idx"
                    class="list-group-item d-flex align-items-center gap-2"
                    draggable="true"
                    @dragstart="onChildDragStart(idx)"
                    @dragover.prevent
                    @drop="onChildDrop(idx)"
                  >
                    <span class="badge bg-light text-secondary border me-1">#{{ idx + 1 }}</span>

                    <input
                      class="form-control form-control-sm"
                      v-model="child.columnName"
                      placeholder="Name"
                      style="max-width: 40%"
                    />

                    <select class="form-select form-select-sm" v-model="child.type" style="max-width: 30%">
                      <option value="STRING">Text</option>
                      <option value="NUMBER">Number</option>
                      <option value="DATE">Date</option>
                      <option value="BOOLEAN">Boolean</option>
                      <option value="ARRAY">Array</option>
                    </select>

                    <div class="ms-auto d-flex gap-1">
                      <button class="btn btn-outline-secondary btn-sm" @click="moveChild(idx, -1)" :disabled="idx === 0">
                        <i class="fa fa-arrow-up"></i>
                      </button>
                      <button class="btn btn-outline-secondary btn-sm" @click="moveChild(idx, +1)" :disabled="idx === form.children.length - 1">
                        <i class="fa fa-arrow-down"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" @click="removeChild(idx)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </li>
                </ul>

                <p v-if="!form.children.length" class="text-muted small mt-3 mb-0">
                  No items added yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive, watch, ref, onMounted } from 'vue';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import Multiselect from 'vue-multiselect';
import { BOOLEAN, DATA_TYPE } from './constant';

const props = defineProps({ schema: { type: Object, required: true } });

// Local editing buffer for the selected property
const form = reactive({
  id: '',
  columnName: '',
  type: '',
  default: '',
  enum: [],
  children: [] // for ARRAY only
});

const { handleSubmit, errors, setValues } = useForm({
  initialValues: { columnName: '', type: '' }
});

let dragIndex = ref(null);

watch(() => props.schema.property, (val) => {
  if (!val) return;
  form.id = val.id || '';
  form.columnName = val.columnName || '';
  form.type = val.type || '';
  form.default = val.default ?? '';
  form.enum = Array.isArray(val.enum) ? [...val.enum] : [];
  form.children = Array.isArray(val.children) ? JSON.parse(JSON.stringify(val.children)) : [];
}, { immediate: true });

// Save general fields back to the main schema
const saveGeneral = handleSubmit(() => {
  const i = props.schema.columns.findIndex(c => c.id === form.id);
  if (i >= 0) {
    props.schema.columns[i] = {
      ...props.schema.columns[i],
      columnName: form.columnName,
      type: form.type,
      default: form.default,
      enum: form.enum,
      children: form.type === 'ARRAY' ? form.children : undefined
    };
    props.schema.property = { ...form };
  }
});

// Helpers to keep default in enum when applicable
const addTag = (newTag) => {
  if (!Array.isArray(form.enum)) form.enum = [];
  if (!form.enum.includes(newTag)) form.enum = [...form.enum, newTag];
};
const ensureDefaultInEnum = () => {
  if (!Array.isArray(form.enum)) form.enum = [];
  if (form.default && !form.enum.includes(form.default)) {
    form.enum = [...form.enum, form.default];
  }
};
const syncDefaultEnum = () => ensureDefaultInEnum();

const handleTypeChange = () => {
  if (form.type === 'NUMBER') form.default = Number(form.default) || 0;
  else if (form.type === 'BOOLEAN') form.default = Boolean(form.default);
  else if (form.type === 'ARRAY') form.children = form.children || [];
};

// ARRAY children controls
const addChild = () => {
  form.children.push({
    id: `${Date.now()}_${form.children.length}`,
    columnName: 'Item',
    type: 'STRING'
  });
};
const removeChild = (idx) => form.children.splice(idx, 1);
const moveChild = (idx, delta) => {
  const ni = idx + delta;
  if (ni < 0 || ni >= form.children.length) return;
  const item = form.children[idx];
  form.children.splice(idx, 1);
  form.children.splice(ni, 0, item);
};
// Basic drag-to-reorder support without extra libs
const onChildDragStart = (idx) => { dragIndex.value = idx; };
const onChildDrop = (to) => {
  const from = dragIndex.value;
  if (from === null || from === to) return;
  moveChild(from, to - from);
  dragIndex.value = null;
};

const closeProperty = () => { props.schema.property = null; };

onMounted(() => {
  // All behavior is declarative; no imperative Bootstrap init needed for accordion
});
</script>
