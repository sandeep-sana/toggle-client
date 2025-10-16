<template>
    <!-- <Form @submit="handleSubmit"> -->
        <div class="d-flex head">
            <div class="form-name col-lg-2">
                <Field class="field" as="input" type="text" v-model="form.name" name="name" placeholder="Name..."
                    rules="required"></Field>
                <ErrorMessage name="name"></ErrorMessage>
            </div>
        </div>
    <!-- </Form> -->
    <div class="form-builder">
        <div class="left col-lg-2">
            <div class="block">
                <Tools />
            </div>
        </div>
        <div class="editor-container" @dragover="(event) => $onDragover(event)"
            @dragleave="(event) => $onDragleave(event)" @drop="(event) => $onDrop(event, form)">
            <div class="row">
                <div v-for="(block, blockIndex) in form.blocks" :key="block.id"
                    :class="`position-relative col-lg-${block.attribute.size}`" @click="onProperty(block)">
                    <div draggable="true" @dragstart="(event) => $onDragStart(event, block, true, block.id)">
                        <div class="leyar left" @dragover="$onDragItHereover" @dragleave="$onDragItHereleave"
                            @drop="(event) => $onDrop(event, form, blockIndex, blockIndex)">
                            <div class="drag left">
                            </div>
                        </div>
                        <div class="leyar top" @dragover="$onDragItHereover" @dragleave="$onDragItHereleave"
                            @drop="(event) => $onDrop(event, form, blockIndex)">
                            <div class="drag top"></div>
                        </div>
                        <component :is="components[block.is]" :block="block" :formBuilder="formBuilder" :form="form">
                        </component>
                        <div class="leyar right" @dragover="$onDragItHereover" @dragleave="$onDragItHereleave"
                            @drop="(event) => $onDrop(event, form, blockIndex + 1, blockIndex)">
                            <div class="drag right"></div>
                        </div>
                        <div class="leyar bottom" @dragover="$onDragItHereover" @dragleave="$onDragItHereleave"
                            @drop="(event) => $onDrop(event, form, blockIndex + 1)">
                            <div class="drag bottom"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3">
            <Property v-if="form.attribute" :form="form" />
        </div>
    </div>
    <pre>{{ form.blocks }}</pre>
</template>

<script setup>
import { defineProps } from 'vue';
import Tools from './tools/Tools.vue';
import Property from './Property.vue';
import TextInput from './blocks/TextInput.vue';
import Heading from './blocks/Heading.vue';
import Paragraph from './blocks/Paragraph.vue'
import { ErrorMessage, Field } from 'vee-validate';
import api from '~~/api.config';
import { STATUS } from '~~/constant';

const config = useRuntimeConfig();
const { $onDragover, $onDragleave, $onPropertyout, $speak, $toast, } = useNuxtApp();

const props = defineProps({
    form: { type: Object },
})

const components = { TextInput, Heading, Paragraph };
const formBuilder = reactive({
    isEditMode: true,
});
const form = reactive(props.form);

const onProperty = (block) => {
    if (form.attribute) {
        // $onPropertyout(JSON.parse(JSON.stringify(form.attribute.id)));
    }
    form.attribute = block.attribute;
    form.style = block.style;
    $speak(`selected ${block.label}`);

}

// const handleSubmit = async () => {
//     try {
//         if (form.blocks.length) {
//             const query = {
//                 _id: form._id,
//             }
//             const projection = {
//                 ...form,
//             }
//             const options = {
//                 new: true,
//                 upsert: true,
//                 rawResult: true,
//             }
//             const response = await api.post(`${config.public.API}/form/update`, {
//                 query: JSON.stringify(query),
//                 projection: JSON.stringify(projection),
//                 options: JSON.stringify(options),
//             });
//             if(response.status === STATUS.OK){
//                 $toast.success(response.data.message);
//                 $speak(response.data.message);
//             }
//         } else {
//             $toast.info('Please drag any field');
//             $speak('Please drag any field');
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

</script>

<style scoped>
.leyar {
    position: absolute;
}

.leyar.top {
    height: 40px;
    width: calc(100% - 20px);
    z-index: 21;

}

.leyar.bottom {
    height: 35px;
    width: calc(100% - 20px);
    bottom: 0;
    z-index: 21;

}

.leyar.left {
    width: 90px;
    height: 100%;
    z-index: 22;
}

.leyar.right {
    width: 90px;
    height: 100%;
    z-index: 22;
    top: 0;
    right: 10px;
    
}

.drag-active {
    opacity: 1 !important;
}

.drag {
    position: absolute;
    border-radius: 5px;
    text-align: center;
    opacity: 0;
    z-index: 20;
}

.drag.left {
    background-color: green;
    height: 100%;
    width: 5px;
    left: 5px;
    top: 0px;
}

.drag.top {
    background-color: green;
    height: 5px;
    width: calc(100% - 20px);
    left: 10px;
    top: 0px;
}

.drag.right {
    background-color: green;
    height: 100%;
    width: 5px;
    right: 5px;
    top: 0px;
}

.drag.bottom {
    background-color: green;
    height: 5px;
    width: calc(100% - 20px);
    left: 10px;
    bottom: 0px;
}

.head {
    justify-content: space-between;
}

.head button {
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    padding: 5px 10px;
    background-color: var(--background-color-two);
    color: var(--text-color-one);
}

.head button:hover {
    background-color: var(--background-color-three);
}

.form-name .field {
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    padding: 10px;
    background-color: var(--background-color-two);
    color: var(--text-color-one);
    margin-bottom: 10px;
    width: 100%;
}

.form-builder {
    display: flex;
}



.editor-container {
    flex-basis: 70%;
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    padding: 10px;
}

.element {
    margin: 10px;
}
</style>