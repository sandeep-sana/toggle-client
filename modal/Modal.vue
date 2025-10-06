<template>
    <div class="modal-bg" style="width: 100%; height: 100%;">
        <div class="modal-data">
            <!-- Header -->
            <div class="modal-header">
                <slot name="header"></slot>
            </div>
            <!-- Body -->
            <div class="modal-body">
                <slot name="body"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    /* background-color: #0000004b; */
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-data
{
    width: 100%;
    height: 100%;
    background-color: var(--background-color-one);
    padding: 10px;
    border: 1px solid var(--border-color-one);
    color: var(--text-color-one);
    border-radius: 12px;
}
.modal-header{
    justify-content: space-between;
}
</style>
