<template>
  <TransitionRoot as="template" :show="drawer">
    <Dialog as="div" class="fixed inset-0 overflow-hidden" @close="drawer = false">
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-00"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="absolute inset-0 bg-slate-700 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <div class="relative w-screen max-w-md">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-500"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-500"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    @click="drawer = false"
                  >
                    <span class="sr-only">Close panel</span>
                    <XIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div
                class="h-full flex flex-col py-6 bg-slate-600 text-white shadow-xl overflow-y-scroll"
              >
                <div class="px-4 sm:px-6">
                  <DialogTitle class="text-lg font-medium"> Settings </DialogTitle>
                </div>
                <div class="mt-6 relative flex-1 px-4 sm:px-6">
                  <!-- Replace with your content -->
                  <div class="absolute inset-0 px-4 sm:px-6">
                    <settings-colors />
                  </div>
                  <!-- /End replace -->
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/outline'
import { useUiStore } from '../../../store/ui/ui.store'
import SettingsColors from './SettingsColors.vue'

export default defineComponent({
  name: 'DrawerSettings',
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XIcon,
    SettingsColors,
  },
  setup() {
    const store = useUiStore()

    const drawer = computed({
      get: () => store.settingsDrawer || false, // bez || false, transition place
      set: (val) => {
        store.settingsDrawer = val
      },
    })

    return {
      drawer,
    }
  },
})
</script>

<style lang="scss" scoped></style>
