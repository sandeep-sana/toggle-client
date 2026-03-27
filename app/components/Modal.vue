<template> <!-- SANDEEP SANA-->
    <div class="modal-bg">
        <div class="modal-data" role="dialog" aria-modal="true">
            <div class="modal-header">
                <slot name="header"></slot>
            </div>
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
    right: 0;
    bottom: 0;
    z-index: 1000;
    background:
        radial-gradient(circle at 20% 10%, rgba(99, 102, 241, 0.16), transparent 45%),
        radial-gradient(circle at 80% 90%, rgba(168, 85, 247, 0.14), transparent 45%),
        rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
}

.modal-data {
    width: min(34rem, 100%);
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    overflow-x: hidden;
    background:
        linear-gradient(180deg, rgba(42, 42, 64, 0.98) 0%, rgba(24, 24, 36, 0.98) 100%);
    padding: 1rem;
    border: 1px solid rgba(203, 213, 225, 0.24);
    color: var(--text-color-one);
    border-radius: 16px;
    box-shadow:
        0 32px 80px rgba(0, 0, 0, 0.58),
        0 0 0 1px rgba(255, 255, 255, 0.06) inset,
        0 0 28px rgba(129, 140, 248, 0.16);
    box-sizing: border-box;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
}

.modal-body {
    padding-top: 0.2rem;
    width: 100%;
    box-sizing: border-box;
}

@media (max-width: 520px) {
    .modal-bg {
        padding: 0.65rem;
    }

    .modal-data {
        max-height: calc(100vh - 1.3rem);
        padding: 0.9rem 0.85rem 0.8rem;
        border-radius: 10px;
    }
}
</style>
