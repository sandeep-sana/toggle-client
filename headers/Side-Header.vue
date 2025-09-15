<template>
  <!-- Parent div that controls layout -->
  <div :class="layout.position">
    <div class="custom-header p-4">
      <draggable :group="{ name: 'custom' }" v-model="sideHeader.user.modules" item-key="name" animation="200">
        <template #item="{ element }">
          <button class="m-2 p-2 bg-blue-500 text-black rounded"
            @click="$router.push(`/${sideHeader.user.role.toLowerCase()}/${element.toLowerCase()}`)">
            {{ element.toLowerCase() }}
          </button>
        </template>
      </draggable>
      <div class="accordion accordion-flush" id="accordionFlushExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
              Masters
            </button>
          </h2>
          <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <draggable :group="{ name: 'master' }" v-model="sideHeader.user.masters" item-key="name" animation="200">
                <template #item="{ element }">
                  <button class="m-2 p-2 bg-blue-500 text-black rounded"
                    @click="$router.push(`/${sideHeader.user.role.toLowerCase()}/master/${element._id}`)">
                    {{ element.name.toLowerCase() }}
                  </button>
                </template>
              </draggable>
            </div>
          </div>
        </div>
      </div>
      <button @click="$logout" class="logout-btn">Logout</button>
    </div>
  </div>
</template>



<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import { onMounted, reactive } from "vue";
import draggable from "vuedraggable";
import { subDomain } from "~~/function";
import { useGlobalStore } from "~/stores/global";
const props = defineProps({
  layout: { type: Object }
});

const sideHeader = reactive({
  user: {
    modules: [],
    masters:[],
  }
});
const config = useRuntimeConfig();
const globalStore = useGlobalStore();
const { $logout, $session } = useNuxtApp();

const updateModules = async () => {
  try {
    const projection = { modules: sideHeader.user.modules };
    const response = await api.post(`${config.public.API}/user/user/${sideHeader.user._id}`, {
      projection: JSON.stringify(projection),
    });
    if (response.status === STATUS.OK) {
    }
  } catch (error) {
    console.log(error);
  }
};

watch(sideHeader.user.modules, async () => {
  await updateModules();
})

watch(() => globalStore.isSideHeader, async () => {
  await init();
})
watch(() => globalStore.isMaster, async () => {
  await initMasters();
})

const initMasters = async () => {
  try {
    const projection = {
      name: 1,
    }
    const response = await api.get(`${config.public.API}/master/fetchs`, {
      params: {
        projection: JSON.stringify(projection),
      }
    });
    if (response.status === STATUS.OK) {
      sideHeader.user.masters = response.data.masters;
    }

  } catch (error) {
    console.log(error);
  }
}

const init = async () => {
  try {
    subDomain();
    sideHeader.user._id = $session();
    const res = await api.get(`${config.public.API}/user/user/${sideHeader.user._id}`);
    if (res.status === STATUS.OK) {
      sideHeader.user = res.data.user;
    }
    await initMasters();
  } catch (err) {
    console.error(err);
  }
};

onMounted(init);
</script>
<style scoped>
/* ---------- Base header container ---------- */
.custom-header {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
  transition: width .25s ease, height .25s ease, padding .25s ease, gap .25s ease, background .25s ease;
  padding: 14px;
}

/* Stop overriding Tailwind button colors */
.custom-header button {
  border: none;
  outline: none;
  text-transform: capitalize;
  background: none;
}

/* Make module buttons feel clickable (keeps Tailwind bg/text) */
.custom-header button.bg-blue-500 {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
  transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
}

.custom-header button.bg-blue-500:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(59, 130, 246, 0.35);
}

.custom-header button.bg-blue-500:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
}

/* ---------- Position variants ---------- */

/* Left & Right = vertical sidebar */
.left .custom-header,
.right .custom-header {
  flex-direction: column;
  align-items: stretch;
  width: 280px;
  min-height: 100vh;
  height: 100vh;
  padding: 18px 14px;
  gap: 8px;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

/* Make module buttons full-width in vertical menus */
.left .custom-header button.bg-blue-500,
.right .custom-header button.bg-blue-500 {
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  padding-left: 14px;
  /* complements your Tailwind p-2 */
}

/* Logout sticks to bottom in vertical */
.left .custom-header .logout-btn,
.right .custom-header .logout-btn {
  margin-top: auto;
  width: 100%;
}

/* Top = horizontal header */
.top .custom-header {
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px 12px;
  height: auto;
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: saturate(160%) blur(6px);
}

/* In top layout, push Logout to the far end */
.top .custom-header .logout-btn {
  margin-left: auto;
}

/* ---------- Logout button ---------- */
.logout-btn {
  padding: 10px 16px;
  background-color: #ef4444;
  /* Tailwind red-500 */
  /* color: #fff; */
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
  transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease, opacity .15s ease;
}

.logout-btn:hover {
  background-color: #dc2626;
  /* red-600 */
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
  transform: translateY(-1px);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}

/* ---------- Drag & scroll polish ---------- */
/* SortableJS classes (vuedraggable) */
.sortable-chosen {
  opacity: 0.95;
}

.sortable-ghost {
  opacity: 0.6;
  transform: scale(0.995);
}

/* Subtle custom scrollbar for sidebars */
.left .custom-header,
.right .custom-header {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  /* slate-300 */
}

.left .custom-header::-webkit-scrollbar,
.right .custom-header::-webkit-scrollbar {
  width: 8px;
}

.left .custom-header::-webkit-scrollbar-thumb,
.right .custom-header::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}

/* ---------- Small screens ---------- */
@media (max-width: 768px) {

  .left .custom-header,
  .right .custom-header {
    width: 88vw;
    border-radius: 0 14px 14px 0;
  }

  .top .custom-header {
    gap: 6px 8px;
    padding: 12px;
  }
}
</style>
