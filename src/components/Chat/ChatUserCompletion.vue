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
        <div v-click-outside="() => $emit('closePopup')">
          <MenuItem
            v-for="user in availableUsers"
            :key="`online-user-${user.user_id}`"
            @click.stop="onClickOption(user.username)"
          >
            <div
              class="block px-4 py-2 text-sm text-white font-bold hover:bg-slate-700 cursor-pointer"
              :class="{ 'bg-slate-700': selectedUser === user.username }"
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
import { Menu, MenuItem, MenuItems } from '@headlessui/vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useUserStore } from '../../store/user/user.store'

const emit = defineEmits(['selectOption', 'closePopup'])
const props = defineProps({
  userCompletion: { type: String, default: null },
})

const store = useUserStore()
const selectedUser = ref<string | null>(null)
const currentIndex = ref(0)
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)

  if (availableUsers.value) {
    selectedUser.value = availableUsers.value[currentIndex.value].username
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress)
})

const handleKeyPress = (e: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
    e.stopPropagation()
    e.preventDefault()
    e.key === 'Enter' ? handleEnter() : handleArrow(e.key as 'ArrowUp' | 'ArrowDown')
  }
}
const handleArrow = (key: 'ArrowUp' | 'ArrowDown') => {
  if (!availableUsers.value) return
  key === 'ArrowUp' ? currentIndex.value++ : currentIndex.value--

  if (currentIndex.value < 0) {
    currentIndex.value = availableUsers.value.length - 1
  }
  if (currentIndex.value >= availableUsers.value.length) {
    currentIndex.value = 0
  }
  selectedUser.value = availableUsers.value[currentIndex.value].username
}
const handleEnter = () => {
  if (!availableUsers.value) return
  onClickOption(availableUsers.value[currentIndex.value].username)
}

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
watch(
  () => availableUsers.value,
  (users) => {
    if (users && users.length > 0) {
      selectedUser.value = users[0].username
    }
  }
)

const onClickOption = (username: string) => {
  emit('selectOption', username)
}
</script>
