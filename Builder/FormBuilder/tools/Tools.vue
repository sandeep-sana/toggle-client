<template>
    <div class="tools-wrapper">
        <!-- Tab Navigation -->
        <div class="tools-tabs">
            <button 
                @click="tools.activeTool = 'FIELDS'" 
                class="tab-btn"
                :class="{ active: tools.activeTool === 'FIELDS' }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>Fields</span>
            </button>
            <button 
                @click="tools.activeTool = 'STATIC'" 
                class="tab-btn"
                :class="{ active: tools.activeTool === 'STATIC' }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Static</span>
            </button>
            <button 
                @click="tools.activeTool = 'STRUCTURES'" 
                class="tab-btn"
                :class="{ active: tools.activeTool === 'STRUCTURES' }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Structure</span>
            </button>
        </div>

        <!-- Tools List -->
        <div class="tools-list">
            <div 
                v-for="tool in FORM_BUILDER.TOOLS[tools.activeTool]" 
                :key="tool.id"
                class="tool-item"
                @dragstart="(event) => $onDragStart(event, tool)" 
                draggable="true">
                <div class="tool-icon">
                    <i :class="tool.icon"></i>
                </div>
                <div class="tool-content">
                    <h4 class="tool-title">{{ tool.label }}</h4>
                    <p class="tool-desc">{{ tool.description }}</p>
                </div>
                <div class="drag-indicator">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="9" cy="5" r="1.5" fill="currentColor"/>
                        <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="9" cy="19" r="1.5" fill="currentColor"/>
                        <circle cx="15" cy="5" r="1.5" fill="currentColor"/>
                        <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="15" cy="19" r="1.5" fill="currentColor"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { FORM_BUILDER } from '../constant';

const { $onDragStart } = useNuxtApp();

const tools = reactive({
    activeTool: 'FIELDS',
})
</script>

<style scoped>
/* Wrapper */
.tools-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
}

/* Tabs */
.tools-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.375rem;
    padding: 0.5rem;
    background: var(--background-color-one);
    border-radius: 0.5rem;
}

.tab-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    height: 34px;
    padding: 0 0.625rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    color: var(--text-color-muted);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.tab-btn span {
    display: none;
}

.tab-btn svg {
    flex-shrink: 0;
}

.tab-btn:hover {
    background: var(--background-color-two);
    color: var(--text-color-one);
}

.tab-btn.active {
    background: linear-gradient(135deg, var(--accent-color-primary), var(--accent-color-secondary));
    border-color: transparent;
    color: var(--text-color-two);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Tools List */
.tools-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 0.5rem 0.5rem;
    max-height: calc(100vh - 300px);
}

/* Tool Item */
.tool-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem;
    background: var(--background-color-one);
    border: 1px solid var(--border-color-one);
    border-radius: 0.5rem;
    cursor: grab;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    min-height: 52px;
}

.tool-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, var(--accent-color-primary), var(--accent-color-secondary));
    opacity: 0;
    transition: opacity 0.2s ease;
}

.tool-item:hover {
    background: var(--background-color-two);
    border-color: var(--accent-color-primary);
    transform: translateX(2px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.tool-item:hover::before {
    opacity: 1;
}

.tool-item:active {
    cursor: grabbing;
    transform: scale(0.98);
}

/* Tool Icon */
.tool-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--background-color-three);
    border: 1px solid var(--border-color-one);
    border-radius: 0.375rem;
    color: var(--accent-color-primary);
    font-size: 0.875rem;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.tool-item:hover .tool-icon {
    background: linear-gradient(135deg, var(--accent-color-primary), var(--accent-color-secondary));
    border-color: transparent;
    color: var(--text-color-two);
}

/* Tool Content */
.tool-content {
    min-width: 0;
}

.tool-title {
    margin: 0 0 0.125rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-color-two);
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tool-desc {
    margin: 0;
    font-size: 0.6875rem;
    color: var(--text-color-muted);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Drag Indicator */
.drag-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-muted);
    opacity: 0;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
}

.tool-item:hover .drag-indicator {
    opacity: 1;
}

/* Scrollbar */
.tools-list::-webkit-scrollbar {
    width: 4px;
}

.tools-list::-webkit-scrollbar-track {
    background: transparent;
}

.tools-list::-webkit-scrollbar-thumb {
    background: var(--border-color-one);
    border-radius: 2px;
}

.tools-list::-webkit-scrollbar-thumb:hover {
    background: var(--hover-background-color-one);
}

/* Responsive - Show tab text on wider screens */
@media (min-width: 1400px) {
    .tab-btn span {
        display: inline;
    }
}

/* Compact for smaller panels */
@media (max-width: 1200px) {
    .tool-item {
        padding: 0.5rem;
        gap: 0.5rem;
    }
    
    .tool-icon {
        width: 28px;
        height: 28px;
        font-size: 0.75rem;
    }
    
    .tool-title {
        font-size: 0.75rem;
    }
    
    .tool-desc {
        font-size: 0.625rem;
    }
}
</style>
