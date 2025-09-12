<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="confirm-backdrop"
        @click="onBackdrop"
        @keydown.esc.prevent="onEsc"
      >
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="ids.title"
          :aria-describedby="ids.desc"
          ref="dialog"
          @keydown.enter.prevent="onEnter"
        >
          <button class="icon-close" aria-label="Close" @click="onCancel" />

          <div class="confirm-header">
            <slot name="title">
              <h5 :id="ids.title" class="m-0">{{ computedTitle }}</h5>
            </slot>
          </div>

          <div class="confirm-body">
            <slot>
              <p :id="ids.desc" class="mb-0">{{ computedMessage }}</p>
            </slot>
          </div>

          <div class="confirm-footer">
            <slot name="actions">
              <button
                class="btn btn-outline-dark btn-sm"
                type="button"
                :disabled="busy"
                ref="cancelBtn"
                @click="onCancel"
              >
                {{ cancelText }}
              </button>
              <button
                class="btn btn-success btn-sm"
                type="button"
                :disabled="busy"
                ref="confirmBtn"
                @click="onConfirm"
              >
                <span v-if="busy" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';

const props = defineProps({
  /** Legacy mode (keeps your existing usage) */
  modal: { type: Object, default: null }, // { isConfirmation, message, _id, reject }
  /** Modern controlled mode */
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmation' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  closeOnBackdrop: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true },
  autofocus: { type: String, default: 'confirm' }, // 'confirm' | 'cancel'
  busy: { type: Boolean, default: false }
});

const emit = defineEmits(['update:open', 'confirm', 'cancel', 'closed']);

const isLegacy = computed(() => !!props.modal);
const isOpen = computed(() => (isLegacy.value ? props.modal?.isConfirmation : props.open));

const computedTitle = computed(() => props.modal?.title || props.title);
const computedMessage = computed(() => props.modal?.message || props.message);

const confirmBtn = ref(null);
const cancelBtn = ref(null);
const dialog = ref(null);

const uid = Math.random().toString(36).slice(2);
const ids = { title: `confirm-title-${uid}`, desc: `confirm-desc-${uid}` };

watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    (props.autofocus === 'cancel' ? cancelBtn.value : confirmBtn.value)?.focus();
  }
});

function close() {
  if (isLegacy.value) {
    // Keep compatibility with your current pattern
    props.modal.isConfirmation = false; // eslint-disable-line vue/no-mutating-props
  } else {
    emit('update:open', false);
  }
  emit('closed');
}

function onCancel() {
  emit('cancel');
  close();
}

function onConfirm() {
  // Legacy: call provided handler with _id (your current flow)
  if (isLegacy.value && typeof props.modal?.reject === 'function') {
    // Original behavior: close first, then perform action
    close();
    props.modal.reject(props.modal._id);
    emit('confirm');
    return;
  }
  // Modern mode: emit and let parent handle (optionally keep open until done)
  emit('confirm');
}

function onBackdrop(e) {
  if (!props.closeOnBackdrop) return;
  if (e.target === e.currentTarget) onCancel();
}

function onEsc() {
  if (props.closeOnEsc) onCancel();
}

function onEnter() {
  onConfirm();
}
</script>

<style scoped>
/* --- Black & White theme --- */
:root {
  --bw-bg: rgba(0,0,0,.6);
  --panel-bg: #fff;
  --panel-fg: #000;
  --border: #e5e5e5;
  --shadow: 0 20px 60px rgba(0,0,0,.25), 0 6px 20px rgba(0,0,0,.15);
}

.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* deeper black tint */
  backdrop-filter: blur(8px);     /* glass blur effect */
  -webkit-backdrop-filter: blur(8px); /* Safari support */
  display: grid;
  place-items: center;
  z-index: 1055;
  padding: 16px;
}

.confirm-dialog {
  width: 100%;
  max-width: 460px;
  background: white;
  color: var(--panel-fg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  outline: none;
  transform: translateY(0);
  animation: pop .16s ease-out;
}

.confirm-header,
.confirm-body,
.confirm-footer {
  padding: 16px 18px;
}

.confirm-header {
  border-bottom: 1px solid var(--border);
}

.confirm-body {
  color: #333;
  line-height: 1.5;
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid var(--border);
}

/* Close icon */
.icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
}
.icon-close::before, .icon-close::after {
  content: "";
  position: absolute;
  top: 16px; left: 10px; right: 10px;
  height: 2px; background: #000;
}
.icon-close::before { transform: rotate(45deg); }
.icon-close::after { transform: rotate(-45deg); }
.icon-close:focus { outline: 2px solid #000; outline-offset: 2px; }

/* Buttons (BW only; piggybacks Bootstrap if present) */
.btn { border-radius: 10px; }
.btn-dark:focus,
.btn-outline-dark:focus { box-shadow: none; outline: 2px solid #000; outline-offset: 2px; }

/* Transition */
.fade-enter-from { opacity: 0; }
.fade-enter-to { opacity: 1; }
.fade-leave-from { opacity: 1; }
.fade-leave-to { opacity: 0; }
.fade-enter-active,
.fade-leave-active { transition: opacity .12s ease; }

@keyframes pop {
  from { transform: translateY(6px); opacity: .98; }
  to   { transform: translateY(0);   opacity: 1; }
}
</style>
