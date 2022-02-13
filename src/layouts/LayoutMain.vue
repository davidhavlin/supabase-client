<template>
  <div class="max-h-screen h-full bg-gray-900 flex flex-col justify-end">
    <div class="h-full">
      <router-view></router-view>
    </div>

    <div class="py-3 text-slate-700 text-sm mx-auto text-center">
      Designed and built with <span class="text-red-500">♥</span> by
      <a class="hover:underline text-blue-400" href="https://davidhavlin.com">David Havlin</a>.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayoutMain',
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
