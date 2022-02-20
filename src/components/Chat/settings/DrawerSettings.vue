<template>
  <TransitionRoot as="template" :show="drawer">
    <Dialog as="div" class="fixed z-50 inset-0 overflow-hidden" @close="drawer = false">
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
                  <div class="absolute flex flex-col items-end inset-0 px-4 sm:px-6">
                    <sup-select
                      v-model="selectedColor"
                      label="Username color"
                      :options="colorOptions"
                      class="w-full"
                    >
                      <template #option-icon="{ option }">
                        <div class="w-4 h-4 rounded-md" :class="`bg-${option.value}`"></div>
                      </template>
                    </sup-select>
                    <sup-select
                      v-model="selectedIcon"
                      :options="iconOptions"
                      label="Profile icon"
                      class="mt-4 w-full"
                      searchable
                      static
                    >
                      <template #option-icon="{ option }">
                        <div>
                          <div
                            class="w-6 h-6 rounded-md flex items-center justify-center bg-primary-def"
                          >
                            <i class="text-base" :class="option.value"></i>
                          </div>
                        </div>
                      </template>
                    </sup-select>
                    <button
                      class="mt-4 px-4 py-2 text-base font-semibold shadow-md rounded text-white bg-primary-def focus:outline-none hover:bg-primary-light"
                    >
                      Upraviť
                    </button>
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
import SupSelect from './SupSelect.vue'
import { colorOptions } from './data-colors'
import { iconOptions } from './data-icons'

const icons = [{ value: 'someIcon', label: 'Icon' }]

export default defineComponent({
  name: 'DrawerSettings',
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XIcon,
    SupSelect,
  },
  setup() {
    const store = useUiStore()

    const selectedColor = ref(colorOptions[0])
    const selectedIcon = ref(iconOptions[0])

    const drawer = computed({
      get: () => store.settingsDrawer || false, // bez || false, transition place
      set: (val) => {
        store.settingsDrawer = val
      },
    })

    return {
      drawer,
      colorOptions,
      iconOptions,
      selectedColor,
      selectedIcon,
    }
  },
})
</script>

<style lang="scss" scoped></style>
