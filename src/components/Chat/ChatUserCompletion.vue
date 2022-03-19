<template>
  <Menu as="div" class="absolute inline-block text-left">
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
        class="origin-bottom-left left-0 -translate-y-full absolute z-50 -top-3 mb-4 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-slate-700 focus:outline-none overflow-hidden"
      >
        <div tabindex="1" v-click-outside="() => $emit('closePopup')">
          <MenuItem
            v-for="user in availableUsers"
            :key="`online-user-${user.user_id}`"
            @click.stop="onClickOption(user.username)"
          >
            <div
              class="block px-4 py-2 text-sm text-white font-bold hover:bg-slate-700 cursor-pointer"
            >
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

const emit = defineEmits(['selectOption', 'closePopup'])
const props = defineProps({
  userCompletion: { type: String, default: null },
})

const store = useUserStore()

const availableUsers = computed(() => {
  if (!store.onlineUsers || !store.user) return null
  return store.onlineUsers?.filter((onlineUser) => {
    const username = onlineUser.username.toLowerCase()
    const completion = props.userCompletion && props.userCompletion.toLowerCase()
    if (onlineUser.user_id === store.user?.id || username === store.user?.username.toLowerCase())
      return false
    if (completion) return username.includes(completion)
    return true
  })
})

const onClickOption = (username: string) => {
  emit('selectOption', username)
}
</script>

<style lang="scss" scoped></style>
