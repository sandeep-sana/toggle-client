<template>
    <div class="form-builder-wrapper">
        <!-- Top Bar -->
        <div class="top-bar">
            <div class="form-title-section">
                <div class="icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="title-input-wrapper">
                    <Field 
                        class="form-title-input" 
                        as="input" 
                        type="text" 
                        v-model="form.name" 
                        name="name" 
                        placeholder="Untitled Form"
                        rules="required"
                    />
                    <ErrorMessage name="name" class="error-msg"></ErrorMessage>
                </div>
            </div>
            <div class="top-bar-actions">
                <div class="block-count">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <span>{{ form.blocks.length }} {{ form.blocks.length === 1 ? 'Field' : 'Fields' }}</span>
                </div>
            </div>
        </div>

        <!-- Main Workspace -->
        <div class="workspace">
            <!-- Toolbox Panel -->
            <div class="toolbox-panel">
                <div class="panel-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <h3>Components</h3>
                </div>
                <div class="panel-body">
                    <Tools />
                </div>
            </div>

            <!-- Canvas Area -->
            <div class="canvas-area">
                <div 
                    class="canvas-dropzone" 
                    :class="{ 'has-blocks': form.blocks.length > 0 }"
                    @dragover="(event) => $onDragover(event)"
                    @dragleave="(event) => $onDragleave(event)" 
                    @drop="(event) => $onDrop(event, form)">
                    
                    <!-- Empty State -->
                    <div v-if="form.blocks.length === 0" class="empty-canvas">
                        <div class="empty-illustration">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                                <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <h4>Start Building Your Form</h4>
                        <p>Drag and drop components from the left panel to begin</p>
                        <div class="empty-hint">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <span>Click on any field to configure its properties</span>
                        </div>
                    </div>

                    <!-- Form Blocks -->
                    <div v-else class="form-canvas">
                        <div 
                            v-for="(block, blockIndex) in form.blocks" 
                            :key="block.id"
                            :class="`field-block field-col-${block.size}`" 
                            @click="onProperty(block)">
                            <div 
                                class="field-wrapper" 
                                :class="{ 'field-selected': form.property?.id === block.id }"
                                draggable="true" 
                                @dragstart="(event) => $onDragStart(event, block, true, block.id)">
                                
                                <!-- Drop Indicators -->
                                <div class="drop-area area-left" 
                                    @dragover="$onDragItHereover" 
                                    @dragleave="$onDragItHereleave"
                                    @drop="(event) => $onDrop(event, form, blockIndex, blockIndex)">
                                    <div class="drop-line line-left"></div>
                                </div>
                                <div class="drop-area area-top" 
                                    @dragover="$onDragItHereover" 
                                    @dragleave="$onDragItHereleave"
                                    @drop="(event) => $onDrop(event, form, blockIndex)">
                                    <div class="drop-line line-top"></div>
                                </div>
                                
                                <!-- Field Content -->
                                <div class="field-content">
                                    <div class="field-handle">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <circle cx="9" cy="5" r="1" fill="currentColor"/>
                                            <circle cx="9" cy="12" r="1" fill="currentColor"/>
                                            <circle cx="9" cy="19" r="1" fill="currentColor"/>
                                            <circle cx="15" cy="5" r="1" fill="currentColor"/>
                                            <circle cx="15" cy="12" r="1" fill="currentColor"/>
                                            <circle cx="15" cy="19" r="1" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <component :is="components[block.is]" :block="block" :formBuilder="formBuilder" :form="form"></component>
                                </div>
                                
                                <div class="drop-area area-right" 
                                    @dragover="$onDragItHereover" 
                                    @dragleave="$onDragItHereleave"
                                    @drop="(event) => $onDrop(event, form, blockIndex + 1, blockIndex)">
                                    <div class="drop-line line-right"></div>
                                </div>
                                <div class="drop-area area-bottom" 
                                    @dragover="$onDragItHereover" 
                                    @dragleave="$onDragItHereleave"
                                    @drop="(event) => $onDrop(event, form, blockIndex + 1)">
                                    <div class="drop-line line-bottom"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Properties Panel -->
            <div v-if="form.property" class="properties-panel">
                <div class="panel-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <h3>Properties</h3>
                    <button class="close-panel-btn" @click="form.property = null">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="panel-body">
                    <Property :form="form" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, reactive } from 'vue';
import Tools from './tools/Tools.vue';
import Property from './Property.vue';
import TextInput from './blocks/TextInput.vue';
import NumberInput from './blocks/NumberInput.vue';
import EmailInput from './blocks/EmailInput.vue';
import PhoneInput from './blocks/PhoneInput.vue';
import PasswordInput from './blocks/PasswordInput.vue';
import UrlInput from './blocks/UrlInput.vue';
import { ErrorMessage, Field } from 'vee-validate';

const config = useRuntimeConfig();
const { $onDragover, $onDragleave, $onPropertyout, $speak } = useNuxtApp();

const props = defineProps({
    form: { type: Object },
})

const components = { TextInput, NumberInput, EmailInput, PhoneInput, PasswordInput, UrlInput };
const formBuilder = reactive({
    isEditMode: true,
});
const form = reactive(props.form);

const onProperty = (block) => {
    if (form.property) {
        $onPropertyout(JSON.parse(JSON.stringify(form.property.id)));
    }
    form.property = block;
    $speak(`selected ${block.label}`);
}
</script>

<style scoped>
/* Main Wrapper */
.form-builder-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
}

/* Top Bar */
.top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    background: linear-gradient(135deg, var(--background-color-two), var(--background-color-three));
    border: 1px solid var(--border-color-one);
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, var(--accent-color-primary), var(--accent-color-secondary));
    border-radius: 0.625rem;
    color: var(--text-color-two);
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.title-input-wrapper {
    position: relative;
    flex: 1;
    max-width: 400px;
}

.form-title-input {
    width: 100%;
    height: 44px;
    padding: 0 1rem;
    background: var(--background-color-one);
    border: 2px solid transparent;
    border-radius: 0.5rem;
    color: var(--text-color-two);
    font-size: 1rem;
    font-weight: 600;
    outline: none;
    transition: all 0.2s ease;
}

.form-title-input:focus {
    border-color: var(--accent-color-primary);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-title-input::placeholder {
    color: var(--text-color-muted);
    font-weight: 500;
}

.error-msg {
    position: absolute;
    bottom: -1.25rem;
    left: 0;
    font-size: 0.6875rem;
    color: var(--error-color);
    font-weight: 500;
}

.top-bar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.block-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--background-color-one);
    border: 1px solid var(--border-color-one);
    border-radius: 2rem;
    color: var(--text-color-one);
    font-size: 0.8125rem;
    font-weight: 600;
}

/* Workspace */
.workspace {
    display: grid;
    grid-template-columns: 300px 1fr 320px;
    gap: 1rem;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

/* Panels */
.toolbox-panel,
.properties-panel {
    display: flex;
    flex-direction: column;
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.panel-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 1rem 1.25rem;
    background: var(--background-color-three);
    border-bottom: 1px solid var(--border-color-one);
}

.panel-header h3 {
    flex: 1;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-color-two);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.panel-header svg {
    color: var(--accent-color-primary);
}

.close-panel-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--background-color-one);
    border: 1px solid var(--border-color-one);
    border-radius: 0.375rem;
    color: var(--text-color-one);
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-panel-btn:hover {
    background: var(--error-color);
    border-color: var(--error-color);
    color: var(--text-color-two);
}

.panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
}

/* Canvas Area */
.canvas-area {
    display: flex;
    flex-direction: column;
    background: var(--background-color-one);
    border: 1px solid var(--border-color-one);
    border-radius: 0.75rem;
    overflow: hidden;
}

.canvas-dropzone {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    background-image: 
        repeating-linear-gradient(0deg, transparent, transparent 19px, var(--border-color-one) 19px, var(--border-color-one) 20px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, var(--border-color-one) 19px, var(--border-color-one) 20px);
    background-size: 20px 20px;
    transition: all 0.3s ease;
}

.canvas-dropzone.has-blocks {
    background-image: none;
}

/* Empty State */
.empty-canvas {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    text-align: center;
    padding: 3rem;
}

.empty-illustration {
    margin-bottom: 1.5rem;
    color: var(--text-color-muted);
    opacity: 0.3;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.empty-canvas h4 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color-two);
}

.empty-canvas p {
    margin: 0 0 1.5rem;
    font-size: 0.9375rem;
    color: var(--text-color-one);
}

.empty-hint {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 0.5rem;
    color: var(--text-color-one);
    font-size: 0.8125rem;
}

/* Form Canvas */
.form-canvas {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-content: flex-start;
}

.field-block {
    position: relative;
}

.field-wrapper {
    position: relative;
    background: var(--background-color-two);
    border: 2px solid var(--border-color-one);
    border-radius: 0.625rem;
    padding: 1rem;
    cursor: move;
    transition: all 0.2s ease;
}

.field-wrapper:hover {
    border-color: var(--accent-color-primary);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.field-wrapper.field-selected {
    border-color: var(--accent-color-secondary);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
}

.field-content {
    position: relative;
}

.field-handle {
    position: absolute;
    top: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 20px;
    background: var(--background-color-three);
    border: 1px solid var(--border-color-one);
    border-radius: 1rem;
    color: var(--text-color-muted);
    opacity: 0;
    transition: opacity 0.2s ease;
    cursor: grab;
}

.field-wrapper:hover .field-handle {
    opacity: 1;
}

/* Drop Areas */
.drop-area {
    position: absolute;
    z-index: 25;
}

.area-top {
    top: -8px;
    left: 0;
    right: 0;
    height: 40px;
}

.area-bottom {
    bottom: -8px;
    left: 0;
    right: 0;
    height: 40px;
}

.area-left {
    top: 0;
    left: -8px;
    bottom: 0;
    width: 60px;
}

.area-right {
    top: 0;
    right: -8px;
    bottom: 0;
    width: 60px;
}

/* Drop Indicators */
.drop-line {
    position: absolute;
    background: linear-gradient(135deg, var(--complete-color-one), var(--accent-color-primary));
    border-radius: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0 0 12px rgba(52, 211, 153, 0.5);
}

.drag-active {
    opacity: 1 !important;
}

.line-top {
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
}

.line-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
}

.line-left {
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
}

.line-right {
    top: 0;
    right: 0;
    bottom: 0;
    width: 4px;
}

/* Column Sizes */
.field-col-3 { width: calc(25% - 0.75rem); }
.field-col-4 { width: calc(33.333% - 0.75rem); }
.field-col-6 { width: calc(50% - 0.75rem); }
.field-col-8 { width: calc(66.666% - 0.75rem); }
.field-col-12 { width: 100%; }

/* Scrollbar */
.panel-body::-webkit-scrollbar,
.canvas-dropzone::-webkit-scrollbar {
    width: 8px;
}

.panel-body::-webkit-scrollbar-track,
.canvas-dropzone::-webkit-scrollbar-track {
    background: var(--background-color-one);
}

.panel-body::-webkit-scrollbar-thumb,
.canvas-dropzone::-webkit-scrollbar-thumb {
    background: var(--border-color-one);
    border-radius: 4px;
}

.panel-body::-webkit-scrollbar-thumb:hover,
.canvas-dropzone::-webkit-scrollbar-thumb:hover {
    background: var(--hover-background-color-one);
}

/* Responsive */
@media (max-width: 1400px) {
    .workspace {
        grid-template-columns: 240px 1fr 300px;
    }
}

@media (max-width: 1200px) {
    .workspace {
        grid-template-columns: 220px 1fr;
    }
    
    .properties-panel {
        position: fixed;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        width: 320px;
        max-height: 80vh;
        z-index: 1000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
}

@media (max-width: 768px) {
    .top-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
    
    .title-input-wrapper {
        max-width: 100%;
    }
    
    .workspace {
        grid-template-columns: 1fr;
    }
    
    .toolbox-panel {
        order: -1;
        max-height: 250px;
    }
    
    .field-col-3,
    .field-col-4,
    .field-col-6,
    .field-col-8,
    .field-col-12 {
        width: 100%;
    }
}
</style>
