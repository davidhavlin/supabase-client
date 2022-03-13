<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="z-10 relative flex items-center focus:outline-none select-none">
      <span
        class="px-2 py-2 cursor-pointer rounded inline-flex items-center text-slate-700 hover:text-white"
      >
        <IconOptions />
      </span>
      <div v-if="user.avatar_url" class="avatar">
        <div class="w-10 mask mask-squircle">
          <img :src="user.avatar_url" />
        </div>
      </div>
      <div v-else class="avatar uppercase font-bold">
        <div class="w-10 mask mask-squircle !flex items-center justify-center bg-slate-400 text-xl">
          {{ user.username[0] }}
        </div>
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="origin-bottom-right right-0 -translate-y-full absolute -top-3 mb-4 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <div class="block px-4 py-2 text-sm text-primary-def font-bold">
              {{ user.username }}
            </div>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="uiStore.settingsDrawer = true"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block w-full px-4 py-2 text-left text-sm',
              ]"
            >
              Nastavenie
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click.stop="toggleHideAnonymMessages"
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'px-4 py-2 text-sm w-full flex items-center justify-between',
              ]"
            >
              Schovať anonym správy
              <input
                id="checkbox-all"
                v-model="userStore.hideAnonymMessages"
                type="checkbox"
                class="w-4 h-4 text-primary-def bg-gray-100 rounded border-gray-300 focus:ring-primary-def dark:focus:ring-primary-dark dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </button>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="userStore.logoutUser"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block w-full px-4 py-2 text-sm text-left',
              ]"
            >
              Odhlásiť sa
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import IconOptions from '../../../assets/icons/IconOptions.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUiStore } from '../../../store/ui/ui.store'
import { IRegisteredUser } from '../../../store/user/user.types'
import { useUserStore } from '../../../store/user/user.store'
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'hide-anonym-messages'

const props = defineProps<{
  user: IRegisteredUser
}>()

const uiStore = useUiStore()
const userStore = useUserStore()

onMounted(() => {
  const key = localStorage.getItem(STORAGE_KEY)
  if (key) {
    userStore.hideAnonymMessages = key === 'hide'
  }
})

const toggleHideAnonymMessages = () => {
  userStore.hideAnonymMessages = !userStore.hideAnonymMessages

  localStorage.setItem(STORAGE_KEY, userStore.hideAnonymMessages ? 'hide' : 'show')
}
</script>
