<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="z-10 relative flex items-center focus:outline-none select-none">
      <span
        class="px-2 py-2 cursor-pointer rounded inline-flex items-center text-slate-700 hover:text-white"
      >
        <IconOptions />
      </span>
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
              {{ user?.username }}
            </div>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="openDrawer"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block w-full px-4 py-2 text-left text-sm',
              ]"
            >
              Settings
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              >Move</a
            >
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              >Logout</a
            >
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import IconOptions from '../../../assets/icons/IconOptions.vue'
import SpDropdown from '../../buttons/SpDropdown.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUserStore } from '../../../store/user/user.store'
import { useUiStore } from '../../../store/ui/ui.store'

export default defineComponent({
  name: 'ChatSettings',
  components: { IconOptions, SpDropdown, Menu, MenuButton, MenuItem, MenuItems },
  setup() {
    const userStore = useUserStore()
    const uiStore = useUiStore()

    const openDrawer = () => {
      uiStore.settingsDrawer = true
    }

    const user = computed(() => userStore.user)
    return {
      user,
      openDrawer,
    }
  },
})
</script>

<style lang="scss" scoped></style>
