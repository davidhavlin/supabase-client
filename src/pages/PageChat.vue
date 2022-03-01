<template>
  <main class="max-w-6xl mx-auto flex flex-col h-full">
    <!-- <h1 class="text-3xl font-bold underline">Hello world!</h1> -->

    <chat-main />

    <chat-footer />

    <drawer-settings />
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatFooter from '../components/Chat/ChatFooter.vue'
import ChatMain from '../components/Chat/ChatMain.vue'
import DrawerSettings from '../components/Chat/settings/DrawerSettings.vue'
import { useUserStore } from '../store/user/user.store'

export default defineComponent({
  name: 'PageChat',
  components: { ChatFooter, ChatMain, DrawerSettings },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    onMounted(() => {
      if (!userStore.user) {
        router.push({ name: 'PageWelcome' })
      }
    })
    return {}
  },
})
</script>
