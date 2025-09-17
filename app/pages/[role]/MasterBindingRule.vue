<template>
  <h1>Master Binding Rule</h1>
  <form @submit.prevent="saveRule">
    <div v-for="(rule, ruleIndex) in values.rules" :key="ruleIndex" class="mb-3">
      <!-- Rule Mapping -->
      <Field :name="`rules[${ruleIndex}].ruleMapping`" as="select" class="form-control" rules="required">
        <option disabled value="">Select Rule Mapping</option>
        <option v-for="map in MASTER_BINDING_RULE.RULE_MAPPING" :key="map.value" :value="map.value">
          {{ map.label }}
        </option>
      </Field>
      <ErrorMessage :name="`rules[${ruleIndex}].ruleMapping`" class="error-message" />

      <!-- Input Expression -->
      <Field :name="`rules[${ruleIndex}].inputExpression`" as="select" class="form-control mt-2" rules="required">
        <option disabled value="">Select Input Expression</option>
        <option v-for="field in masterBindingRule.master.fields" :key="field._id" :value="field._id">
          {{ field.columnName }}
        </option>
      </Field>
      <ErrorMessage :name="`rules[${ruleIndex}].inputExpression`" class="error-message" />

      <!-- Rule Row Condition -->
      <Field :name="`rules[${ruleIndex}].ruleRowCondition`" as="select" class="form-control mt-2" rules="required">
        <option disabled value="">Select Rule Row Condition</option>
        <option v-for="map in MASTER_BINDING_RULE.RULE_ROW_CONDITION" :key="map.value" :value="map.value">
          {{ map.label }}
        </option>
      </Field>
      <ErrorMessage :name="`rules[${ruleIndex}].ruleRowCondition`" class="error-message" />

      <!-- Input Data (Master) -->
      <Field :name="`rules[${ruleIndex}].inputData`" as="select" class="form-control mt-2" rules="required"
        @change="loadOutputFields(ruleIndex, values.rules[ruleIndex].inputData)">
        <option disabled value="">Select Input Data</option>
        <option v-for="map in masterBindingRule.masters" :key="map._id" :value="map._id">
          {{ map.name }}
        </option>
      </Field>
      <ErrorMessage :name="`rules[${ruleIndex}].inputData`" class="error-message" />

      <!-- Output Expression -->
      <Field v-if="rule.outputFields?.length" :name="`rules[${ruleIndex}].outputExpression`" as="select" class="form-control mt-2" rules="required">
        <option disabled value="">Select Output Expression</option>
        <option v-for="map in rule.outputFields" :key="map._id" :value="map._id">
          {{ map.columnName }}
        </option>
      </Field>
      <ErrorMessage :name="`rules[${ruleIndex}].outputExpression`" class="error-message" />

      <!-- Remove Rule Button -->
      <button type="button" class="btn btn-danger mt-2" @click="removeMasterBindingRule(ruleIndex)">❌ Remove Rule</button>
    </div>
    <button type="submit" class="btn btn-primary mt-3">Save Rules</button>
  </form>

  <button type="button" class="btn btn-secondary mt-2" @click="addMasterBindingRule">+ Add Rule</button>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ErrorMessage, Field, useForm } from "vee-validate";
import { MASTER_BINDING_RULE } from "../../../common/constant";
import api from "~~/api.config";
import STATUS from "~~/status";

const route = useRoute();
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();

const masterBindingRule = reactive({
  master: {},
  masters: [],
});

// Computed property for masterId
const _id = computed(() => route.params._id);

const { values, handleSubmit, setValues } = useForm({
  initialValues: {
    rules: [],
  },
});

// Add Rule Row
const addMasterBindingRule = () => {
  const newRule = {
    ruleMapping: "",
    inputExpression: "",
    ruleRowCondition: "",
    inputData: "",
    outputExpression: "",
    outputFields: [],
  };

  // Use `setValues` to update the form state
  setValues({
    ...values,
    rules: [...values.rules, newRule], // Add new rule to the existing rules
  });
};

// Remove Rule Row
const removeMasterBindingRule = (ruleIndex) => {
  const updatedRules = values.rules.filter((_, index) => index !== ruleIndex);
  setValues({
    ...values,
    rules: updatedRules, // Remove the rule from the existing rules
  });
};

// Load current master
const initMaster = async () => {
  try {
    const response = await api.get(`${config.public.API}/master/fetch/${_id.value}`);
    if (response.status === STATUS.OK) {
      masterBindingRule.master = response.data.master;
    }
  } catch (error) {
    console.error(error);
  }
};

// Load all masters for inputData dropdown
const initMasters = async () => {
  try {
    const response = await api.get(`${config.public.API}/master/fetchs`);
    if (response.status === STATUS.OK) {
      masterBindingRule.masters = response.data.masters?.filter(
        (master) => master._id !== _id.value
      ) || [];
    }
  } catch (error) {
    console.error(error);
  }
};

// Fetch fields for selected InputData → store in rule row
const loadOutputFields = async (ruleIndex, masterId) => {
  try {
    if (!masterId) return;
    const response = await api.get(`${config.public.API}/master/fetch/${masterId}`);
    if (response.status === STATUS.OK) {
      const updatedRules = [...values.rules];
      updatedRules[ruleIndex].outputFields = response.data.master.fields || [];

      // Update form values to reflect the changes
      setValues({
        ...values,
        rules: updatedRules,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// Save rules
const saveRule = handleSubmit(async (values) => {
  try {
    const query = {
      _id: _id.value,
    }
    const projection = {
      _id: _id.value,
      rules: values.rules,
    };
    const options = {
      new: true,
      upsert: true,
      rawResult: true,
    }

    const response = await api.post(`${config.public.API}/masterBindingRule/add`, {
      query: JSON.stringify(query),
      projection: JSON.stringify(projection),
      options: JSON.stringify(options),
    });

    if (response.status === STATUS.OK) {
      $toast.success(response.data.message);
    }
  } catch (error) {
    console.error(error);
  }
});

// Fetch masterBindingRules on mount
const init = async () => {
  try {
    const response = await api.get(`${config.public.API}/masterBindingRule/fetch/${_id.value}`);
    if (response.status === STATUS.OK) {
      setValues({
        ...values,
        rules: response.data.masterBindingRule?.rules || [],
      });
      response.data.masterBindingRule.rules.map(async (rule, ruleIndex) => {
        await loadOutputFields(ruleIndex, rule.inputData);
      })
    }
  } catch (error) {
    console.log(error);
  }
}

// Initialize master and masters on mounted
onMounted(async () => {
  await init();
  await initMaster();
  await initMasters();
});
</script>
