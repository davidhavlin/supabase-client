<template>
  <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md dark:bg-gray-800">
    <div class="mb-4 w-full">
      <label class="block mb-2 text-sm font-bold text-left text-white" for="pretext-input"
        >Zadaj jednorazovy nick</label
      >

      <div class="flex justify-between w-full">
        <div class="flex-1">
          <input
            id="pretext-input"
            class="w-full border font-bold bg-slate-500 focus:bg-white placeholder:text-white px-4 py-2 rounded-lg focus:shadow-outline outline-none"
            type="text"
            placeholder="@nick"
          />
        </div>
        <button
          class="inline-flex items-center ml-3 justify-center cursor-pointer px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Vstup
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WelcomeEntry',
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
