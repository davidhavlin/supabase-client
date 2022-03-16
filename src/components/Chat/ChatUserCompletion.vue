<template>
  <Menu as="div" class="relative inline-block text-left">
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        static
        class="origin-bottom-left left-0 -translate-y-full absolute z-50 -top-3 mb-4 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-slate-700 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem
            v-for="user in onlineUsers"
            :key="`online-user-${user.user_id}`"
            v-slot="{ active }"
          >
            <div class="block px-4 py-2 text-sm text-primary-def font-bold">
              {{ user.username }}
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { computed } from 'vue'
import { useUserStore } from '../../store/user/user.store'

const store = useUserStore()

const onlineUsers = computed(() => store.onlineUsers)
</script>

<style lang="scss" scoped></style>
