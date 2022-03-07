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
        <div class="fixed inset-y-0 right-0 max-w-full flex">
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
                  <DialogTitle class="text-lg font-medium">Settings</DialogTitle>
                </div>
                <div class="mt-6 relative flex-1 px-4 sm:px-6">
                  <!-- Replace with your content -->
                  <div class="absolute flex flex-col items-end inset-0 px-4 sm:px-6">
                    <div class="w-full">
                      <div class="mb-1 text-sm font-medium text-primary-def">Username</div>
                      <input
                        id="pretext-input"
                        class="w-full bg-slate-700 placeholder:text-slate-500 text-white font-bold focus:placeholder:text-white focus:bg-slate-800 px-4 py-2 rounded focus:shadow-outline outline-none"
                        type="text"
                        placeholder="Odoslať správu"
                        v-model="username"
                        @keydown.enter="$emit('addMessage')"
                      />
                    </div>
                    <sup-select
                      v-model="selectedColor"
                      label="Username color"
                      :options="colorOptions"
                      class="w-full mt-4"
                    >
                      <template #option-icon="{ option }">
                        <div class="w-4 h-4 rounded-md" :class="`bg-${option.value}`"></div>
                      </template>
                    </sup-select>
                    <sup-select
                      v-model="selectedIcons"
                      :options="iconOptions"
                      label="Profile icon"
                      class="mt-4 w-full"
                      searchable
                      static
                    >
                      <template #option-icon="{ option }">
                        <div
                          class="w-6 h-6 rounded-md flex items-center justify-center text-white bg-primary-def"
                        >
                          <i class="text-base" :class="option.value"></i>
                        </div>
                      </template>
                      <template #header-icon="{ values }">
                        <div class="flex flex-row">
                          <div
                            v-for="(opt, i) in values"
                            :key="`option-value-${opt}`"
                            class="w-6 h-6 rounded-md flex items-center justify-center text-white bg-primary-def"
                            :class="{ 'ml-1': i }"
                          >
                            <i class="text-base" :class="opt"></i>
                          </div>
                        </div>
                      </template>
                    </sup-select>
                    <button
                      @click="onSaveChanges"
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

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
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
import { useUserStore } from '../../../store/user/user.store'
import { IOption } from '../../Chat/settings/SupSelect.vue'

const store = useUiStore()
const userStore = useUserStore()
const uiStore = useUiStore()

const user = computed(() => userStore.user)
const username = ref('')
const selectedColor = ref(colorOptions[0])
const selectedIcons = ref<string[]>([])

watch(
  () => user.value,
  (user) => {
    if (user) {
      const activeColor = colorOptions.find((opt) => opt.value === user.color)

      username.value = user.username
      selectedIcons.value = user.icons || []
      selectedColor.value = activeColor ? activeColor : colorOptions[0]
    }
  }
)

username.value = user.value ? user.value.username : ''

const drawer = computed({
  get: () => store.settingsDrawer || false, // bez || false, transition place
  set: (val) => {
    store.settingsDrawer = val
  },
})

const onSaveChanges = () => {
  if (!username.value) return

  const updateUser = {
    username: username.value,
    color: selectedColor.value.value,
    icons: selectedIcons.value,
  }
  userStore.updateUser(updateUser)
  uiStore.showNotify({ type: 'success', label: 'Profil upravený' })
}
</script>

<style lang="scss" scoped></style>
