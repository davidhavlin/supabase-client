<template>
  <Menu as="div" class="relative inline-block text-left z-50">
    <MenuButton class="z-10 relative flex items-center focus:outline-none select-none">
      <slot></slot>
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
        class="origin-bottom-left left-0 -translate-y-full absolute -top-3 mb-4 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-slate-700 focus:outline-none"
        v-if="userStore.user"
      >
        <div class="">
          <MenuItem>
            <div :class="colorClass" class="block px-4 py-2 text-sm font-bold">
              {{ message.username }}
            </div>
          </MenuItem>
        </div>
        <div
          v-if="
            userStore.user.id !== message.user_id &&
            userStore.user.anonym_id !== message.anonym_id &&
            userStore.user.username !== message.username
          "
          class="py-1"
        >
          <MenuItem v-slot="{ active }" @click="$emit('toggleBlockUser')">
            <div class="block cursor-pointer px-4 py-2 text-sm text-slate-400 font-bold">
              Zablokovať uživateľa
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useUserStore } from '../../../store/user/user.store'
import { IMessage } from '../../../store/message/message.types'

const userStore = useUserStore()

const props = defineProps<{
  message: Required<IMessage>
  colorClass: string
}>()

const emit = defineEmits(['toggleBlockUser'])
</script>
