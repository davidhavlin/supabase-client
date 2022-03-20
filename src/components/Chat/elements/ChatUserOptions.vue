<template>
  <Menu
    v-slot="{ open }"
    as="div"
    class="relative inline-block text-left z-50"
    :class="{ 'z-[60]': visiblePopup }"
  >
    <MenuButton
      ref="userBtnRef"
      class="z-10 relative flex items-center focus:outline-none select-none"
      @click="handleClick"
    >
      <slot></slot>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
      @before-enter="visiblePopup = true"
      @after-leave="visiblePopup = false"
    >
      <MenuItems
        class="left-0 z-50 absolute w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-slate-700 focus:outline-none"
        :class="[
          noSpaceForTooltip
            ? 'origin-top-left translate-y-7 top-0'
            : 'origin-bottom-left -translate-y-full -top-1',
        ]"
        v-if="userStore.user"
      >
        <div class="">
          <MenuItem>
            <div
              @click="onClickUser"
              :class="colorClass"
              class="block px-4 py-2 text-sm font-bold cursor-pointer"
            >
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
import { onMounted, ref } from 'vue'
import { useMessagesStore } from '../../../store/message/message.store'

const emit = defineEmits(['toggleBlockUser'])
const userStore = useUserStore()
const msgStore = useMessagesStore()

const props = defineProps<{
  message: Required<IMessage>
  colorClass: string
}>()

const userBtnRef = ref<null | any>(null)
const noSpaceForTooltip = ref(false)
const visiblePopup = ref(false)

const handleClick = () => {
  if (!userBtnRef.value) return
  const { top } = userBtnRef.value.$el.getBoundingClientRect()
  noSpaceForTooltip.value = top < 100
}

const onClickUser = () => {
  msgStore.inputMessage += `@${props.message.username}`
}
</script>
