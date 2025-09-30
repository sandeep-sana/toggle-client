<template>
  <div class="header-setting" :style="setting.isToogleSetting
    ? { transform: 'translateX(0px)', }
    : { transform: 'translateX(600px)', }">
    <div @click="setting.isToogleSetting = !setting.isToogleSetting">
      <div class="icon">
        <i class="ri-settings-4-fill"></i>
      </div>
    </div>
    <!-- <div class="body">
      <div class="main-header">
        <div class="header">
          <div>
            <h1>Theme Customizer</h1>
            <h3>Customize & Preview in Real Time</h3>
          </div>
          <div>
            <button type="button"><i class="ri-loop-left-line"></i></button>
            <button type="button" @click="setting.isToogleSetting = !setting.isToogleSetting"><i
                class="ri-close-large-line"></i></button>
          </div>
        </div>
        <hr>
        <div class="data">
          <h3>Theming</h3>
          <div class="heading">
            <h3>Background Color</h3>
            <div>
              <input type="color" v-model="setting.background['--background-color-one']" />
              <input type="color" v-model="setting.background['--background-color-two']" />
              <input type="color" v-model="setting.background['--background-color-three']" />
              <input type="color" v-model="setting.background['--background-color-four']" />
              <input type="color" v-model="setting.background['--background-color-five']" />
              <input type="color" v-model="setting.background['--background-color-six']" />
              <input type="color" v-model="setting.background['--background-color-seven']" />
              <input type="color" v-model="setting.background['--background-color-eight']" />
              <input type="color" v-model="setting.background['--background-color-nine']" />
              <input type="color" v-model="setting.background['--background-color-ten']" />
            </div>
          </div>
          <div class="heading">
            <h3>Text Color</h3>
            <div>
              <input type="color" v-model="setting.text['--text-color-one']" />
              <input type="color" v-model="setting.text['--text-color-two']" />
              <input type="color" v-model="setting.text['--text-color-three']" />
              <input type="color" v-model="setting.text['--text-color-four']" />
              <input type="color" v-model="setting.text['--text-color-five']" />
              <input type="color" v-model="setting.text['--text-color-six']" />
              <input type="color" v-model="setting.text['--text-color-one']" />
              <input type="color" v-model="setting.text['--text-color-seven']" />
              <input type="color" v-model="setting.text['--text-color-eight']" />
              <input type="color" v-model="setting.text['--text-color-nine']" />
              <input type="color" v-model="setting.text['--text-color-ten']" />
            </div>
          </div>
          <div class="heading">
            <h3>Border Color</h3>
            <div>
              <input type="color" v-model="setting.border['--border-color-one']" />
              <input type="color" v-model="setting.border['--border-color-two']" />
              <input type="color" v-model="setting.border['--border-color-three']" />
              <input type="color" v-model="setting.border['--border-color-four']" />
              <input type="color" v-model="setting.border['--border-color-five']" />
              <input type="color" v-model="setting.border['--border-color-six']" />
              <input type="color" v-model="setting.border['--border-color-one']" />
              <input type="color" v-model="setting.border['--border-color-seven']" />
              <input type="color" v-model="setting.border['--border-color-eight']" />
              <input type="color" v-model="setting.border['--border-color-nine']" />
              <input type="color" v-model="setting.border['--border-color-ten']" />
            </div>
          </div>
          <div class="heading">
            <h3>Hover Background Color</h3>
            <div>
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-one']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-two']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-three']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-four']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-five']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-six']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-one']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-seven']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-eight']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-nine']" />
              <input type="color" v-model="setting.hoverBackground['--hover-background-color-ten']" />
            </div>
          </div>
          <div class="heading">
            <h3>Pending Color</h3>
            <div>
              <input type="color" v-model="setting.pending['--pending-color-one']" />
              <input type="color" v-model="setting.pending['--pending-color-two']" />
              <input type="color" v-model="setting.pending['--pending-color-three']" />
              <input type="color" v-model="setting.pending['--pending-color-four']" />
              <input type="color" v-model="setting.pending['--pending-color-five']" />
              <input type="color" v-model="setting.pending['--pending-color-six']" />
              <input type="color" v-model="setting.pending['--pending-color-one']" />
              <input type="color" v-model="setting.pending['--pending-color-seven']" />
              <input type="color" v-model="setting.pending['--pending-color-eight']" />
              <input type="color" v-model="setting.pending['--pending-color-nine']" />
              <input type="color" v-model="setting.pending['--pending-color-ten']" />
            </div>
          </div>
          <div class="heading">
            <h3>Complete Color</h3>
            <div>
              <input type="color" v-model="setting.complete['--complete-color-one']" />
              <input type="color" v-model="setting.complete['--complete-color-two']" />
              <input type="color" v-model="setting.complete['--complete-color-three']" />
              <input type="color" v-model="setting.complete['--complete-color-four']" />
              <input type="color" v-model="setting.complete['--complete-color-five']" />
              <input type="color" v-model="setting.complete['--complete-color-six']" />
              <input type="color" v-model="setting.complete['--complete-color-one']" />
              <input type="color" v-model="setting.complete['--complete-color-seven']" />
              <input type="color" v-model="setting.complete['--complete-color-eight']" />
              <input type="color" v-model="setting.complete['--complete-color-nine']" />
              <input type="color" v-model="setting.complete['--complete-color-ten']" />
            </div>
          </div>
          <h3>Layout</h3>
          <div class="heading">
            <h3>Header Position</h3>
            <div>
              <select id="position" name="position" class="mini-select" v-model="setting.headerPosition">
                <option value="top">Top</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>

</template>
<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { COLOR } from './constant';
import { reactive, watch, onMounted } from 'vue';

const config = useRuntimeConfig();
const emit = defineEmits(['layoutChange']);
const { $session, $toast, $applyTheme } = useNuxtApp();



const setting = reactive({
  isToogleSetting: false,
  color: COLOR,
  headerPosition: 'left'
});

const updateSetting = async () => {
  try {
    const _id = $session();
    const query = {
      _id,
    }
    const projection = {
      _id,
      text: setting.text,
      border: setting.border,
      pending: setting.pending,
      complete: setting.complete,
      background: setting.background,
      headerPosition: setting.headerPosition,
      hoverBackground: setting.hoverBackground,
    };
    const options = {
      new: true,
      upsert: true,
      rawResult: true,
    }
    // await api.post(`${config.public.API}/setting/update`, {
    //   query: JSON.stringify(query),
    //   projection: JSON.stringify(projection),
    //   options: JSON.stringify(options),
    // });
    // emit('layoutChange', {position: setting.headerPosition})
    // $applyTheme({
    //   ...setting.text,
    //   ...setting.border,
    //   ...setting.pending,
    //   ...setting.complete,
    //   ...setting.background,
    //   ...setting.headerPosition,
    //   ...setting.hoverBackground,
    // })


  } catch (error) {
    console.log(error);
  }
}

watch(setting, async () => {
  await updateSetting();
})

const fetchSetting = async () => {
  try {
    const query = {
      _id: $session(),
    }
    const response = await api.get(`${config.public.API}/setting/fetch`, {
      params: {
        query: JSON.stringify(query),
      }
    });
    if (response.status === STATUS.OK) {

      // setting.text = response.data.setting?.text ?? COLOR.text;
      // setting.border = response.data.setting?.border;
      // setting.pending = response.data.setting?.pending;
      // setting.complete = response.data.setting?.complete;
      // setting.background = response.data.setting?.background ?? COLOR.background;
      // setting.headerPosition = response.data.setting?.headerPosition;
      // setting.hoverBackground = response.data.setting?.hoverBackground;
      $applyTheme(COLOR)
    }

  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => {
  await fetchSetting();

})

</script>
<style scoped>
.header-setting {
  position: absolute;
  top: 12vh;
  right: 0;
  z-index: 40;
  display: flex;
  transition: 400ms ease-in-out;
  height: 40px;
}

.header-setting .icon {
  height: 40px;
  cursor: pointer;
  position: relative;
  font-size: 20px;
  padding: 4px 8px;
  color: var(--text-color-nine);
  border-radius: 12px 0px 0px 12px;
  background-color: var(--background-color-four);
}

.header-setting .body {
  width: 600px;
  background: var(--background-color-nine);
}

.main-header {
  padding: 10px;
  position: relative;
  top: -12vh;
  background-color: var(--background-color-nine);
}

.body .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.body h1 {
  font-size: 16px;
  color: var(--text-color-four);
}

.body h3 {
  font-size: 12px;
  color: var(--text-color-six);
}

.header button {
  border: unset;
  background-color: unset;
  font-size: 16px;
  padding: 0 10px;
}

.data h3 {
  background: var(--background-color-eight);
  width: fit-content;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  color: var(--text-color-ten);
}

.data .heading h3 {
  background: unset;
  color: var(--text-color-four);
  font-size: 14px;
  margin: 0;
  padding: 10px;
}
</style>