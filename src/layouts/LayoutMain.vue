<template>
  <div class="max-h-screen overflow-hidden h-full bg-gray-900 flex flex-col justify-end">
    <div class="h-full">
      <router-view></router-view>
    </div>

    <Teleport to="body">
      <loading-container />
      <global-notify />
    </Teleport>

    <div class="py-3 text-slate-700 text-sm mx-auto text-center">
      Designed and built with
      <span class="text-red-500">♥</span> by
      <a class="hover:underline text-primary-def" href="https://davidhavlin.com">David Havlin</a>.
    </div>
  </div>
</template>

<script lang="ts" setup>
import GlobalNotify from '../components/notify/GlobalNotify.vue'
import LoadingContainer from '../components/LoadingContainer.vue'
</script>
