<template>
  <main class="flex flex-col h-full">
    <h1 class="text-3xl font-bold underline">Hello world!</h1>

    <chat-main />

    <chat-footer />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatFooter from '../components/Chat/ChatFooter.vue'
import ChatMain from '../components/Chat/ChatMain.vue'

export default defineComponent({
  name: 'PageChat',
  components: { ChatFooter, ChatMain },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
