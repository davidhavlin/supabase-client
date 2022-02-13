<template>
  <sp-dropdown placement="left">
    <!-- Button content -->
    <template v-slot:button>
      <span
        class="px-2 py-2 cursor-pointer rounded inline-flex items-center text-slate-700 hover:text-white"
      >
        <IconOptions />
      </span>
    </template>

    <!-- Opened dropdown content -->
    <template v-slot:content>
      <a
        class="flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-blue-400 hover:text-white"
        href="#"
        >Profile</a
      >
      <a
        class="flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-blue-400 hover:text-white"
        href="#"
        >Settings</a
      >
      <a
        class="flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-blue-400 hover:text-white"
        href="#"
        >Help</a
      >
    </template>
  </sp-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconOptions from '../../../assets/icons/IconOptions.vue'
import SpDropdown from '../../buttons/SpDropdown.vue'

export default defineComponent({
  name: 'ChatSettings',
  setup() {
    return {}
  },
  components: { IconOptions, SpDropdown },
})
</script>

<style lang="scss" scoped></style>
