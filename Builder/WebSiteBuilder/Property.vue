<template>
  <div class="flex-wrap d-flex">
    <!-- attribute -->
    <h3 class="text-xl font-bold col-12">Attribute</h3>
    <template v-if="property?.attribute">
      <!-- label -->
      <div v-if="'label' in property.attribute" class="property flex-column col-12 align-items-start">
        <label for="label" class="text-lg font-medium text-gray-700">Label</label>
        <Field name="label" class="field" as="input" type="text" v-model="property.attribute.label"
          placeholder="Enter Label" rules="required" />
        <ErrorMessage name="label" class="text-red-500" />
      </div>
      <!-- Size -->
      <div v-if="'size' in property.attribute" class="property col-6 flex-column align-items-start">
        <label for="size" class="text-lg font-medium text-gray-700">Size</label>
        <Field class="field" as="select" v-model="property.attribute.size">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
          <option :value="5">5</option>
          <option :value="6">6</option>
          <option :value="7">7</option>
          <option :value="8">8</option>
          <option :value="9">9</option>
          <option :value="10">10</option>
          <option :value="11">11</option>
          <option :value="12">12</option>
        </Field>
        <ErrorMessage name="name" class="text-red-500" />
      </div>
      <!-- Heading Type -->
      <div v-if="'headingType' in property.attribute" class="property col-6 flex-column align-items-start">
        <label for="headingType" class="text-lg font-medium text-gray-700">Heading Type</label>
        <Field class="field" as="select" v-model="property.attribute.headingType">
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </Field>
        <ErrorMessage name="name" class="text-red-500" />
      </div>
      <!-- src -->
      <div v-if="'src' in property.attribute" class="property flex flex-col gap-4 col-6 flex-column align-items-start">
        <label for="src" class="text-lg font-medium text-gray-700">Take or Upload Photo</label>
        <div class="flex gap-4 mb-4">
          <button
            class="btn btn-outline-primary px-6 py-2 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold"
            v-tippy="`Upload Image`" @click="openFilePicker">
            📁 Upload Image
          </button>
          <button
            class="btn btn-outline-success px-6 py-2 bg-green-100 hover:bg-green-200 rounded-md text-sm font-semibold"
            v-tippy="`Use Camera`" @click="openCamera">
            📸 Use Camera
          </button>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleFileUpload" />
        <div v-if="showCamera" class="camera-modal p-4 border-2 border-gray-300 rounded-lg shadow-lg">
          <video ref="videoRef" autoplay playsinline class="rounded-lg mb-4" style="width: 100%;"></video>
          <button class="btn btn-danger mt-2 bg-red-500 text-white px-4 py-2 rounded-md" @click="capturePhoto">
            Capture
          </button>
          <button class="btn btn-secondary mt-2 bg-gray-500 text-white px-4 py-2 rounded-md" @click="closeCamera">
            Close
          </button>
        </div>
        <div class="mt-4">
          <label for="srcUrl" class="text-lg font-medium text-gray-700">Or Enter Image URL</label>
          <input v-model="property.attribute.srcUrl" class="field p-2 border-2 border-gray-300 rounded-md w-full"
            type="text" placeholder="Enter image URL" @input="updateImageSourceFromUrl" />
        </div>
        <div v-if="property.attribute.src" class="mt-4">
          <img :src="property.attribute.src" alt="Preview" class="rounded-md" width="200"
            style="border: 2px solid #ddd; padding: 4px;" />
        </div>
      </div>
    </template>
    <!-- style -->
    <h3 class="mt-8 text-xl font-bold col-12">Style</h3>
    <template v-if="property?.style">
      <!-- color -->
      <div v-if="'color' in property.style" class="property col-1 flex-column align-items-start">
        <label for="textAlign" class="text-lg font-medium text-gray-700">Color</label>
        <Field class="field" type="color" v-model="property.style.color"></Field>
        <ErrorMessage name="color" class="text-red-500" />
      </div>
      <!-- font size -->
      <div v-if="'fontSize' in property.style" class="property col-5 flex-column align-items-start">
        <label class="text-lg font-medium text-gray-700">Font Size</label>
        <div class="d-flex w-100">
          <Field class="field" type="number" v-model="fontValue" placeholder="Enter value" style="flex: 80;" />
          <Field class="field" as="select" v-model="fontUnit" style="flex: 20;">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="%">%</option>
          </Field>
        </div>
        <ErrorMessage name="fontSize" class="text-red-500" />
      </div>
      <!-- Font Weight -->
      <div v-if="'fontWeight' in property.style" class="property col-6 flex-column align-items-start">
        <label for="fontWeight" class="text-lg font-medium text-gray-700">Font Weight</label>
        <Field class="field" as="select" v-model="property.style.fontWeight">
          <option :value="100">100</option>
          <option :value="200">200</option>
          <option :value="300">300</option>
          <option :value="400">400</option>
          <option :value="500">500</option>
          <option :value="600">600</option>
          <option :value="700">700</option>
          <option :value="800">800</option>
          <option :value="900">900</option>
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="bolder">Bolder</option>
          <option value="lighter">Lighter</option>
        </Field>
        <ErrorMessage name="fontWeight" class="text-red-500" />
      </div>
      <!-- Width -->
      <div v-if="'width' in property.style" class="property col-12 flex-column align-items-start">
        <label class="text-lg font-medium text-gray-700">Width</label>
        <div class="d-flex w-100">
          <Field class="field" type="number" v-model="widthValue" placeholder="Enter value" style="flex: 80;" />
          <Field class="field" as="select" v-model="widthUnit" style="flex: 20;">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="%">%</option>
          </Field>
        </div>
        <ErrorMessage name="width" class="text-red-500" />
      </div>
      <!-- Height -->
      <div v-if="'height' in property.style" class="property col-12 flex-column align-items-start">
        <label class="text-lg font-medium text-gray-700">Height</label>
        <div class="d-flex w-100">
          <Field class="field" type="number" v-model="heightValue" placeholder="Enter value" style="flex: 80;" />
          <Field class="field" as="select" v-model="heightUnit" style="flex: 20;">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="%">%</option>
          </Field>
        </div>
        <ErrorMessage name="width" class="text-red-500" />
      </div>
      <!-- backgroundImage -->
      <div v-if="'backgroundImage' in property.style" class="property col-1 flex-column align-items-start">
        <label for="textAlign" class="text-lg font-medium text-gray-700">Background Image</label>
        <Field class="field" type="file" @change="(e) => handleFileChange(e)" accept="image/*"></Field>
        <ErrorMessage name="backgroundImage" class="text-red-500" />
      </div>
    </template>






    <!-- Text Align -->
    <div v-if="property?.style?.textAlign" class="property">
      <label for="textAlign" class="text-lg font-medium text-gray-700">Text Align</label>
      <Field class="field" as="select" v-model="property.style.textAlign">
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="left">Left</option>
        <option value="justify">Justify</option>
      </Field>
      <ErrorMessage name="textAlign" class="text-red-500" />
    </div>



    <!-- Margin -->
    <div v-if="property?.style?.margin" class="property">
      <label for="margin">Margin</label>
      <Field class="field" as="select" v-model="property.style.margin" @change="margin">
        <option value="">None</option>
        <option value="inherit">inherit</option>
      </Field>
      <ErrorMessage name="margin"></ErrorMessage>
      <template v-if="!['inherit'].includes(property.style.margin)">
        <!-- Margin Left -->
        <div class="property">
          <label for="marginLeft">Margin Left</label>
          <Field class="field" as="select" v-model="property.style.marginLeftType" @change="marginLeftType">
            <option value="">None</option>
            <option value="auto">auto</option>
            <option value="custom">custom</option>
          </Field>
          <template v-if="['custom'].includes(property.style.marginLeftType)">
            <Field class="field" as="input" type="number" v-model="property.style.marginLeftValue"
              @change="marginLeftValue"></Field>
            <Field class="field" as="select" v-model="property.style.marginLeftUnit" @change="marginLeftValue">
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">percentage</option>
            </Field>
          </template>
          <!-- <Field class="field" as="input" type="number" v-model="form.style.marginLeftValue"></Field>
                <ErrorMessage name="marginLeft"></ErrorMessage>
                <select v-model="form.style.marginLeftUnit" class="unit-select">
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="%">percentage</option>
                    <option value="auto">auto</option>
                    <option value="inherit">inherit</option>
                </select> -->
        </div>

        <!-- Margin Right -->
        <div class="property">
          <label for="marginRight">Margin Right</label>
          <Field class="field" as="select" v-model="property.style.marginRightType" @change="marginRightType">
            <option value="">None</option>
            <option value="auto">auto</option>
            <option value="custom">custom</option>
          </Field>
          <template v-if="['custom'].includes(property.style.marginRightType)">
            <Field class="field" as="input" type="number" v-model="property.style.marginRightValue"
              @change="marginRightValue"></Field>
            <Field class="field" as="select" v-model="property.style.marginRightUnit" @change="marginRightValue">
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">percentage</option>
            </Field>
          </template>
        </div>

        <!-- Margin Top -->
        <div class="property">
          <label for="marginTop">Margin Top</label>
          <Field class="field" as="select" v-model="property.style.marginTopType" @change="marginTopType">
            <option value="">None</option>
            <option value="auto">auto</option>
            <option value="custom">custom</option>
          </Field>
          <template v-if="['custom'].includes(property.style.marginTopType)">
            <Field class="field" as="input" type="number" v-model="property.style.marginTopValue"
              @change="marginTopValue">
            </Field>
            <Field class="field" as="select" v-model="property.style.marginTopUnit" @change="marginTopValue">
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">percentage</option>
            </Field>
          </template>
        </div>

        <!-- Margin Bottom -->
        <div class="property">
          <label for="marginBottom">Margin Bottom</label>
          <Field class="field" as="select" v-model="property.style.marginBottomType" @change="marginBottomType">
            <option value="">None</option>
            <option value="auto">auto</option>
            <option value="custom">custom</option>
          </Field>
          <template v-if="['custom'].includes(property.style.marginBottomType)">
            <Field class="field" as="input" type="number" v-model="property.style.marginBottomValue"
              @change="marginBottomValue"></Field>
            <Field class="field" as="select" v-model="property.style.marginBottomUnit" @change="marginBottomValue">
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">percentage</option>
            </Field>
          </template>
        </div>
      </template>
    </div>

  </div>




</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { splitPX } from '../../helper';

// refine code
const props = defineProps({
  property: { type: Object },
});

const property = reactive(props.property);
const heightValue = ref(property.style.heighthSize?.replace(/[^0-9]/g, ""));
const heightUnit = ref(property.style.heighthSize?.replace(/[0-9]/g, ""));

// WATCH START

watch([heightValue, heightUnit], () => { // only height value and height unit will changed
  if (heightValue && heightUnit) {
    property.style.height = `${heightValue.value}${heightUnit.value}`;
  }
});

watch(() => property.style.height, (height) => { // only if height is exist so we distribute the height value and height unit
  const { val, unit } = splitPX(height);
  heightValue.value = val;
  heightUnit.value = unit;
})

// WATCH END

// CHANGE METHODS
const handleFileChange = (event) => {
  const file = event.target.files[0];
  console.log(file)
  if (file) {
    property.style.backgroundImage = `url:( ${URL.createObjectURL(file)})`;
  }
}


// using font size
const fontValue = ref(property.style.fontSize?.replace(/[^0-9]/g, ""));
const fontUnit = ref(property.style.fontSize?.replace(/[0-9]/g, ""));
watch([fontValue, fontUnit], () => {
  property.style.fontSize = `${fontValue.value}${fontUnit.value}`;
});

// using width
const widthValue = ref(property.style.widthSize?.replace(/[^0-9]/g, ""));
const widthUnit = ref(property.style.widthSize?.replace(/[0-9]/g, ""));
watch([widthValue, widthUnit], () => {
  property.style.width = `${widthValue.value}${widthUnit.value}`;
});


onMounted(() => {
  console.log(property.style)
  if (property.style?.width) {
    const { val, unit } = splitPX(property.style.width);
    widthValue.value = val;
    widthUnit.value = unit;
  }
  if (property.style?.height) {
    const { val, unit } = splitPX(property.style.height);
    heightValue.value = val;
    heightUnit.value = unit;
  }
})


// refine code

const fileInput = ref(null);
const previewUrl = ref(null);
const showCamera = ref(false);
const videoRef = ref(null);
let stream = null;




// Handle file upload
const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    property.attribute.src = base64; // Store base64 string
  };
  reader.readAsDataURL(file);
};

// Camera capture
const openCamera = async () => {
  try {
    showCamera.value = true;
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.value.srcObject = stream;
  } catch (err) {
    alert('Unable to access camera. Please allow permissions.');
  }
};

const capturePhoto = () => {
  const canvas = document.createElement('canvas');
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(videoRef.value, 0, 0);
  const base64 = canvas.toDataURL('image/png'); // base64 format
  property.attribute.src = base64; // Store base64 string
  closeCamera();
};

const closeCamera = () => {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  showCamera.value = false;
};

// Handle image URL input
const updateImageSourceFromUrl = async () => {

};
</script>

<style scoped>
.property {
  padding: 10px;
  color: var(--text-color-one);
  display: flex;
  align-items: center;
}


.property .field {
  border: 1px solid var(--border-color-one);
  border-radius: 10px;
  color: var(--text-color-one);
  background-color: var(--background-color-two);
  padding: 10px;
  width: 100%;
}

.camera-modal {
  position: relative;
  border: 2px solid #ccc;
  padding: 10px;
  margin-top: 10px;
  width: fit-content;
}

video {
  width: 250px;
  border-radius: 10px;
}

.d-none {
  display: none;
}

input[type="color"] {
  height: 45px;
  width: 40px !important;
}
</style>