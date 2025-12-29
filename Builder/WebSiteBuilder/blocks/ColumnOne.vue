<template>
    <div class="" :style="block.style">

        {{ block.style }}
    </div>
    <div
    class="background-container"
    :style="{
      backgroundImage: 'url(' + require('@/assets/images/banners/home-banner.webp') + ')'
    }"
  >
    <!-- Your content here -->
  </div>

</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
    block: { type: Object },
    websiteBuilder: { type: Object },
    website: { type: Object },
})

const block = reactive(props.block);
const website = reactive(props.website);
const websiteBuilder = reactive(props.websiteBuilder);
</script>
<style scoped></style>