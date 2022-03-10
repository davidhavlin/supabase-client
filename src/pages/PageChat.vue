<template>
  <main class="max-w-6xl mx-auto flex flex-col h-full">
    <!-- <h1 class="text-3xl font-bold underline">Hello world!</h1> -->

    <chat-main />

    <chat-footer />

    <drawer-settings />
  </main>
</template>

<script lang="ts" setup>
import { onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import ChatFooter from '../components/Chat/ChatFooter.vue'
import ChatMain from '../components/Chat/ChatMain.vue'
import DrawerSettings from '../components/Chat/settings/DrawerSettings.vue'
import { useMessagesStore } from '../store/message/message.store'
import { useUserStore } from '../store/user/user.store'

const userStore = useUserStore()
const messageStore = useMessagesStore()
const router = useRouter()

watch(
  () => userStore.user,
  (user) => {
    if (!user) {
      router.push({ name: 'PageWelcome' })
    } else {
      !userStore.blockedUsers && setBlockedUsers()
    }
  }
)

const setBlockedUsers = () => {
  const blocked = localStorage.getItem('blocked-users')
  userStore.blockedUsers = blocked ? new Set([...JSON.parse(blocked)]) : new Set()
}

const listenSupabase = () => {
  messageStore.listenMessages()
  userStore.listenUsers()
}

const fetchMessages = async () => {
  if (messageStore.chatMessages.length > 0) return
  await messageStore.fetchMessages()
}
const fetchOnlineUsers = async () => {
  if (userStore.onlineUsers) return
  await userStore.fetchOnlineUsers()
}

onBeforeMount(async () => {
  setBlockedUsers()
  listenSupabase()
  await fetchMessages()
  await fetchOnlineUsers()
})
</script>
