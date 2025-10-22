<template>
  <h3 class="text-xl font-bold mb-4">Attribute</h3>

  <!-- Label -->
  <div v-if="form?.attribute?.label" class="property">
    <label for="label" class="text-lg font-medium text-gray-700">Label</label>
    <Field class="field" as="input" type="text" v-model="form.attribute.label" placeholder="Enter Label" />
    <ErrorMessage name="name" class="text-red-500" />
  </div>

  <!-- Size -->
  <div v-if="form?.attribute?.size" class="property">
    <label for="size" class="text-lg font-medium text-gray-700">Size</label>
    <Field class="field" as="select" v-model="form.attribute.size">
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
  <div v-if="form?.attribute?.headingType" class="property">
    <label for="headingType" class="text-lg font-medium text-gray-700">Heading Type</label>
    <Field class="field" as="select" v-model="form.attribute.headingType">
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
  <div v-if="'src' in form.attribute" class="property flex flex-col gap-4">
    <label for="src" class="text-lg font-medium text-gray-700">Take or Upload Photo</label>

    <!-- Buttons for upload and camera -->
    <div class="flex gap-4 mb-4">
      <button
        class="btn btn-outline-primary px-6 py-2 bg-blue-100 hover:bg-blue-200 rounded-md text-sm font-semibold"
        v-tippy="`Upload Image`"
        @click="openFilePicker"
      >
        📁 Upload Image
      </button>
      <button
        class="btn btn-outline-success px-6 py-2 bg-green-100 hover:bg-green-200 rounded-md text-sm font-semibold"
        v-tippy="`Use Camera`"
        @click="openCamera"
      >
        📸 Use Camera
      </button>
    </div>
    <!-- Width -->
    

        <!-- Hidden File Input -->
        <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleFileUpload" />

    <!-- Camera Modal -->
    <div v-if="showCamera" class="camera-modal p-4 border-2 border-gray-300 rounded-lg shadow-lg">
      <video ref="videoRef" autoplay playsinline class="rounded-lg mb-4" style="width: 100%;"></video>
      <button class="btn btn-danger mt-2 bg-red-500 text-white px-4 py-2 rounded-md" @click="capturePhoto">
        Capture
      </button>
      <button class="btn btn-secondary mt-2 bg-gray-500 text-white px-4 py-2 rounded-md" @click="closeCamera">
        Close
      </button>
    </div>

    <!-- Image URL Input -->
    <div class="mt-4">
      <label for="srcUrl" class="text-lg font-medium text-gray-700">Or Enter Image URL</label>
      <input
        v-model="form.attribute.srcUrl"
        class="field p-2 border-2 border-gray-300 rounded-md w-full"
        type="text"
        placeholder="Enter image URL"
        @input="updateImageSourceFromUrl"
      />
    </div>

    <!-- Image Preview -->
    <div v-if="form.attribute.src" class="mt-4">
      <img
        :src="form.attribute.src"
        alt="Preview"
        class="rounded-md"
        width="200"
        style="border: 2px solid #ddd; padding: 4px;"
      />
    </div>
  </div>

  <h3 class="mt-8 text-xl font-bold mb-4">Style</h3>

  <!-- Text Align -->
  <div v-if="form?.style?.textAlign" class="property">
    <label for="textAlign" class="text-lg font-medium text-gray-700">Text Align</label>
    <Field class="field" as="select" v-model="form.style.textAlign">
      <option value="center">Center</option>
      <option value="right">Right</option>
      <option value="left">Left</option>
      <option value="justify">Justify</option>
    </Field>
    <ErrorMessage name="name" class="text-red-500" />
  </div>

  <!-- Font Weight -->
  <div v-if="'fontWeight' in form.style" class="property">
    <label for="fontWeight" class="text-lg font-medium text-gray-700">Font Weight</label>
    <Field class="field" as="select" v-model="form.style.fontWeight">
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
    <ErrorMessage name="name" class="text-red-500" />
  </div>

        <!-- Margin -->
        <div v-if="form?.style?.margin" class="property">
            <label for="margin">Margin</label>
            <Field class="field" as="select" v-model="form.style.margin" @change="margin">
                <option value="">None</option>
                <option value="inherit">inherit</option>
            </Field>
            <ErrorMessage name="margin"></ErrorMessage>
            <template v-if="!['inherit'].includes(form.style.margin)">
                <!-- Margin Left -->
                <div class="property">
                    <label for="marginLeft">Margin Left</label>
                    <Field class="field" as="select" v-model="form.style.marginLeftType" @change="marginLeftType">
                        <option value="">None</option>
                        <option value="auto">auto</option>
                        <option value="custom">custom</option>
                    </Field>
                    <template v-if="['custom'].includes(form.style.marginLeftType)">
                        <Field class="field" as="input" type="number" v-model="form.style.marginLeftValue"
                            @change="marginLeftValue"></Field>
                        <Field class="field" as="select" v-model="form.style.marginLeftUnit" @change="marginLeftValue">
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
                    <Field class="field" as="select" v-model="form.style.marginRightType" @change="marginRightType">
                        <option value="">None</option>
                        <option value="auto">auto</option>
                        <option value="custom">custom</option>
                    </Field>
                    <template v-if="['custom'].includes(form.style.marginRightType)">
                        <Field class="field" as="input" type="number" v-model="form.style.marginRightValue"
                            @change="marginRightValue"></Field>
                        <Field class="field" as="select" v-model="form.style.marginRightUnit"
                            @change="marginRightValue">
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
                    <Field class="field" as="select" v-model="form.style.marginTopType" @change="marginTopType">
                        <option value="">None</option>
                        <option value="auto">auto</option>
                        <option value="custom">custom</option>
                    </Field>
                    <template v-if="['custom'].includes(form.style.marginTopType)">
                        <Field class="field" as="input" type="number" v-model="form.style.marginTopValue"
                            @change="marginTopValue"></Field>
                        <Field class="field" as="select" v-model="form.style.marginTopUnit" @change="marginTopValue">
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
                    <Field class="field" as="select" v-model="form.style.marginBottomType" @change="marginBottomType">
                        <option value="">None</option>
                        <option value="auto">auto</option>
                        <option value="custom">custom</option>
                    </Field>
                    <template v-if="['custom'].includes(form.style.marginBottomType)">
                        <Field class="field" as="input" type="number" v-model="form.style.marginBottomValue"
                            @change="marginBottomValue"></Field>
                        <Field class="field" as="select" v-model="form.style.marginBottomUnit"
                            @change="marginBottomValue">
                            <option value="px">px</option>
                            <option value="rem">rem</option>
                            <option value="em">em</option>
                            <option value="%">percentage</option>
                        </Field>
                    </template>
                </div>
            </template>
        </div>

        <!-- Height -->
        <div class="property">
            <label for="height">Height</label>
            <Field class="field" as="select" v-model="form.style.heightType" @change="heightType">
                <option value="">None</option>
                <option value="auto">auto</option>
                <option value="custom">custom</option>
            </Field>

            <template v-if="form.style.heightType === 'custom'">
                <Field class="field" as="input" type="number" v-model="form.style.heightValue"
                    placeholder="Enter height" @change="heightValue" />
                <Field class="field" as="select" v-model="form.style.heightUnit" @change="heightValue">
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="%">%</option>
                </Field>
            </template>
        </div>

        <!-- Width -->
        <div class="property">
            <label for="width">Width</label>
            <Field class="field" as="select" v-model="form.style.widthType" @change="widthType">
                <option value="">None</option>
                <option value="auto">auto</option>
                <option value="custom">custom</option>
            </Field>

            <template v-if="form.style.widthType === 'custom'">
                <Field class="field" as="input" type="number" v-model="form.style.widthValue" placeholder="Enter width"
                    @change="widthValue" />
                <Field class="field" as="select" v-model="form.style.widthUnit" @change="widthValue">
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="%">%</option>
                </Field>
            </template>
        </div>




</template>

<script setup>
import { ref } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

const props = defineProps({
  form: { type: Object },
});

const form = reactive(props.form);

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
    form.attribute.src = base64; // Store base64 string
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
  form.attribute.src = base64; // Store base64 string
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

.property label {
  width: 20%;
}

.property .field {
  border: 1px solid var(--border-color-one);
  border-radius: 10px;
  color: var(--text-color-one);
  background-color: var(--background-color-two);
  padding: 10px;
  width: 80%;
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
</style>
    