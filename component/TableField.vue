<template>
  <label>{{ column.columnName }}</label>

  <!-- ENUM -->
  <template v-if="column.enum && column.enum.length">
    <Field :name="column.columnName" as="select" :rules="handleValidation(column)">
      <option value="">Please Select</option>
      <option v-for="option in column.enum" :key="option" :value="option">{{ option }}</option>
    </Field>
  </template>

  <!-- NUMBER -->
  <template v-else-if="column.type === 'NUMBER'">
    <Field :name="column.columnName" :rules="handleValidation(column)" v-slot="{ field }">
      <input
        v-bind="field"
        type="number"
        :placeholder="column.columnName"
        :value="field.value ?? column.default"
        @input="field.onChange($event)"
      />
    </Field>
  </template>

  <!-- BOOLEAN -->
  <template v-else-if="column.type === 'BOOLEAN'">
    <Field :name="column.columnName" as="input" type="checkbox" :value="true" :unchecked-value="false"
      :rules="handleValidation(column)" />
  </template>

  <!-- DATE -->
  <template v-else-if="column.type === 'DATE'">
    <Field :name="column.columnName" :rules="handleValidation(column)" v-slot="{ field, errors }">
      <VueDatePicker :model-value="field.value" @update:model-value="val => field.onChange(val)"
        model-type="format" format="yyyy-MM-dd" :enable-time-picker="false" :clearable="true"
        :placeholder="column.columnName" />
      <small v-if="errors[0]" class="text-danger">{{ errors[0] }}</small>
    </Field>
  </template>

  <!-- ARRAY -->
  <template v-else-if="column.type === 'ARRAY'">
    <!-- Structured array (with sub-columns) -->
    <div v-if="column.columns && column.columns[0].columnName">
      <h5>{{ column.columnName }}</h5>
      <button type="button" @click="addRow">Add Row</button>

      <div v-for="(row, rowIndex) in column.value" :key="rowIndex" class="array-row">
        <div v-for="subCol in column.columns" :key="subCol.columnName" class="array-cell">
          <label>{{ subCol.columnName }}</label>
          <Field
            :name="`${column.columnName}[${rowIndex}].${subCol.columnName}`"
            :as="subCol.type === 'NUMBER' ? 'input' : 'input'"
            :type="subCol.type === 'NUMBER' ? 'number' : 'text'"
            :rules="handleValidation(subCol)"
            :placeholder="subCol.columnName"
          />
          <ErrorMessage :name="`${column.columnName}[${rowIndex}].${subCol.columnName}`" />
        </div>
      </div>
    </div>

    <!-- Simple array (multiselect) -->
    <div v-else>
      <Field :name="column.columnName" v-slot="{ field }">
        <Multiselect v-bind="field" :options="[]" :multiple="true" :close-on-select="false"
          placeholder="Pick some" :taggable="true" />
      </Field>
    </div>
  </template>

  <!-- DROPDOWN via binding rule -->
  <template v-else-if="tableField.options.length">
    <Field :name="column.columnName" as="select" :rules="handleValidation(column)">
      <option value=""></option>
      <option v-for="option in tableField.options" :key="option._id" :value="option._id">
        {{ option[tableField.field.columnName] }}
      </option>
    </Field>
  </template>

  <!-- DEFAULT TEXT -->
  <template v-else>
    <Field :name="column.columnName" as="input" type="text" :rules="handleValidation(column)"
      :placeholder="column.columnName" />
  </template>

  <ErrorMessage :name="column.columnName" />
</template>

<script setup>
import STATUS from '~~/status'
import api from '~~/api.config'
import Multiselect from "vue-multiselect"
import VueDatePicker from '@vuepic/vue-datepicker'
import { ErrorMessage, Field } from 'vee-validate'
import { handleValidation } from '../common/common'
import { defineProps, onMounted, computed, reactive } from 'vue'

const route = useRoute()
const props = defineProps({
  column: { type: Object }
})

const column = reactive(props.column)

const tableField = reactive({
  options: [],
  field: {}
})

const config = useRuntimeConfig()
const _id = computed(() => route.params._id)

const getDropDown = async (rule) => {
  try {
    const response = await api.get(`${config.public.API}/dynamicMaster/fetchs/${rule.inputData}`)
    if (response.status === STATUS.OK) {
      tableField.options = response.data.dynamicMasters
    }
  } catch (error) {
    console.error(error)
  }
}

const getSchemaField = async (rule) => {
  try {
    const query = { 'fields._id': rule.outputExpression }
    const projection = { "fields.$": 1 }
    const response = await api.get(`${config.public.API}/master/fetch/${rule.inputData}`, {
      params: { query: JSON.stringify(query), projection: JSON.stringify(projection) }
    })
    if (response.status === STATUS.OK) {
      tableField.field = response.data.master.fields[0]
    }
  } catch (error) {
    console.error(error)
  }
}

const ruleSelection = async (rule) => {
  switch (rule.ruleMapping) {
    case "DROP_DOWN":
      await getDropDown(rule)
      await getSchemaField(rule)
      break
    default:
      break
  }
}

const init = async () => {
  try {
    const query = { "rules.inputExpression": props.column._id }
    const projection = { "rules.$": 1 }
    const response = await api.get(`${config.public.API}/masterBindingRule/fetch/${_id.value}`, {
      params: { query: JSON.stringify(query), projection: JSON.stringify(projection) }
    })
    if (response.status === STATUS.OK && response.data.masterBindingRule) {
      await ruleSelection(response.data.masterBindingRule.rules[0])
    }
  } catch (error) {
    console.error(error)
  }
}

const addRow = () => {
  if (!Array.isArray(column.value)) column.value = []
  const newRow = {}
  column.columns.forEach(subCol => {
    newRow[subCol.columnName] = subCol.default || ""
  })
  column.value.push(newRow)
}

onMounted(async () => {
  // await init()
  if (column.type === 'ARRAY' && !Array.isArray(column.value)) {
    column.value = []
  }
})
</script>
