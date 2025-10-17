<template>
    <h3>Attribute</h3>

    <!-- Label -->
    <div v-if="form?.attribute?.label" class="property">
        <label for="label">Label</label>
        <Field class="field" as="input" type="text" v-model="form.attribute.label"></Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- Size -->
    <div v-if="form?.attribute?.size" class="property">
        <label for="size">Size</label>
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
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- headingType -->
    <div v-if="form?.attribute?.headingType" class="property">
        <label for="headingType">Heading Type</label>
        <Field class="field" as="select" v-model="form.attribute.headingType">
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- src -->
    <div v-if="'src' in form.attribute" class="property flex flex-col gap-2">
    <label for="src">Take or Upload Photo</label>

    <!-- Buttons -->
    <div class="d-flex gap-2">
      <button class="btn btn-outline-primary" v-tippy="`Upload Image`" @click="openFilePicker">📁</button>
      <button class="btn btn-outline-success" v-tippy="`Use Camera`" @click="openCamera">📸</button>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="d-none"
      @change="handleFileUpload"
    />

    <!-- Camera Modal -->
    <div v-if="showCamera" class="camera-modal">
      <video ref="videoRef" autoplay playsinline></video>
      <button class="btn btn-danger mt-2" @click="capturePhoto">Capture</button>
      <button class="btn btn-secondary mt-2" @click="closeCamera">Close</button>
    </div>

    <!-- Preview -->
    <div v-if="form.attribute.src" class="mt-3">
      <img :src="form.attribute.src" alt="Preview" width="200" />
    </div>
  </div>



    <h3>Style</h3>

    <!-- Text Align -->
    <div v-if="form?.style?.textAlign" class="property">
        <label for="textAlign">Text Align</label>
        <Field class="field" as="select" v-model="form.style.textAlign">
            <option value="center">Center</option>
            <option value="right">right</option>
            <option value="left">left</option>
            <option value="justify">justify</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- Font Weight -->
    <div v-if="'fontWeight' in form.style" class="property">
        <label for="fontWeight">Font Weight</label>
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
            <option value="normal">normal</option>
            <option value="bold">bold</option>
            <option value="bolder">bolder</option>
            <option value="lighter">lighter</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
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
                    <Field class="field" as="select" v-model="form.style.marginRightUnit" @change="marginRightValue">
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
                    <Field class="field" as="select" v-model="form.style.marginBottomUnit" @change="marginBottomValue">
                        <option value="px">px</option>
                        <option value="rem">rem</option>
                        <option value="em">em</option>
                        <option value="%">percentage</option>
                    </Field>
                </template>
            </div>
        </template>
    </div>




</template>

<script setup>
import { ErrorMessage, Field } from 'vee-validate';

const props = defineProps({
    form: { type: Object },
})

const form = reactive(props.form);

const margin = () => {
    if (['inherit'].includes(form.style.margin)) {
        if (form.style?.marginLeft) {
            form.style.marginLeft = null;
        }
        if (form.style?.marginLeftValue) {
            form.style.marginLeftValue = null;
        }
        if (form.style?.marginLeftUnit) {
            form.style.marginLeftUnit = null;
        }
        if (form.style?.marginRight) {
            form.style.marginRight = null;
        }
        if (form.style?.marginRightValue) {
            form.style.marginRightValue = null;
        }
        if (form.style?.marginRightUnit) {
            form.style.marginRightUnit = null;
        }
        if (form.style?.marginTop) {
            form.style.marginTop = null;
        }
        if (form.style?.marginTopValue) {
            form.style.marginTopValue = null;
        }
        if (form.style?.marginTopUnit) {
            form.style.marginTopUnit = null;
        }
        if (form.style?.marginBottom) {
            form.style.marginBottom = null;
        }
        if (form.style?.marginBottomValue) {
            form.style.marginBottomValue = null;
        }
        if (form.style?.marginBottomUnit) {
            form.style.marginBottomUnit = null;
        }
    }
}

const marginLeftType = () => {
    if (['auto'].includes(form.style.marginLeftType)) {
        if (form.style?.marginLeftValue) {
            form.style.marginLeftValue = null;
        }
        if (form.style?.marginLeftUnit) {
            form.style.marginLeftUnit = null;
        }
    }
    form.style.marginLeft = form.style.marginLeftType;
}
const marginLeftValue = () => {
    if (form.style?.marginLeftValue && form.style?.marginLeftUnit) {
        form.style.marginLeft = form.style.marginLeftValue + form.style.marginLeftUnit;
    }
}

const marginRightType = () => {
    if (['auto'].includes(form.style.marginRightType)) {
        if (form.style?.marginRightValue) {
            form.style.marginRightValue = null;
        }
        if (form.style?.marginRightUnit) {
            form.style.marginRightUnit = null;
        }
    }
    form.style.marginRight = form.style.marginRightType;
}
const marginRightValue = () => {
    if (form.style?.marginRightValue && form.style?.marginRightUnit) {
        form.style.marginRight = form.style.marginRightValue + form.style.marginRightUnit;
    }
}

const marginTopType = () => {
    if (['auto'].includes(form.style.marginTopType)) {
        if (form.style?.marginTopValue) {
            form.style.marginTopValue = null;
        }
        if (form.style?.marginTopUnit) {
            form.style.marginTopUnit = null;
        }
    }
    form.style.marginRight = form.style.marginRightType;
}
const marginTopValue = () => {
    if (form.style?.marginTopValue && form.style?.marginTopUnit) {
        form.style.marginTop = form.style.marginTopValue + form.style.marginTopUnit;
    }
}

const marginBottomType = () => {
    if (['auto'].includes(form.style.marginBottomType)) {
        if (form.style?.marginBottomValue) {
            form.style.marginBottomValue = null;
        }
        if (form.style?.marginBottomUnit) {
            form.style.marginBottomUnit = null;
        }
    }
    form.style.marginBottom = form.style.marginBottomType;
}
const marginBottomValue = () => {
    if (form.style?.marginBottomValue && form.style?.marginBottomUnit) {
        form.style.marginBottom = form.style.marginBottomValue + form.style.marginBottomUnit;
    }
}


// ========== CAMERA AND UPLOAD SECTION ==========
const fileInput = ref(null);
const showCamera = ref(false);
const videoRef = ref(null);
let stream = null;

// 📁 Upload from System
const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    form.attribute.src = base64; // ✅ store base64 string
  };
  reader.readAsDataURL(file);
};

// 📸 Camera Capture
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
  const base64 = canvas.toDataURL('image/png'); // ✅ base64 format
  form.attribute.src = base64; // ✅ store base64 string
  closeCamera();
};

const closeCamera = () => {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  showCamera.value = false;
};

onBeforeUnmount(() => closeCamera());



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