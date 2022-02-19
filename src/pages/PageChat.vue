<template>
  <main class="flex flex-col h-full">
    <h1 class="text-3xl font-bold underline">Hello world!</h1>

    <chat-main />

    <chat-footer />

    <drawer-settings />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatFooter from '../components/Chat/ChatFooter.vue'
import ChatMain from '../components/Chat/ChatMain.vue'
import DrawerSettings from '../components/Chat/settings/DrawerSettings.vue'

export default defineComponent({
  name: 'PageChat',
  components: { ChatFooter, ChatMain, DrawerSettings },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
