<template>
  <div ref="chatContainerRef" class="mt-auto p-3">
    <chat-message
      ref="msgRefs"
      v-for="message in chatMessages"
      :key="`chat-message-${message.id}`"
      :message="message"
      :colorClass="randomColor()"
      @click="test"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
// import { supabase } from '../../plugins/supabase'
import { Action, useStore } from '../../store'
import { IMessage } from '../../store/state'
import ChatMessage from './elements/ChatMessage.vue'

const colors = [
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
  'text-emerald-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500',
  'text-blue-500',
  'text-indigo-500',
  'text-fuchsia-500',
  'text-pink-500',
]

export default defineComponent({
  name: 'ChatMain',
  components: { ChatMessage },
  setup() {
    const store = useStore()
    const chatContainerRef = ref<HTMLElement | null>(null)

    const randomColor = () => {
      const randomIndex = Math.floor(Math.random() * colors.length)
      return colors[randomIndex]
    }

    const chatMessages = computed(() => store.state.chatMessages)

    const fetchMessages = () => {
      if (store.state.chatMessages.length > 0) return
      store.dispatch(Action.fetchMessages)
    }
    const test = () => {
      console.log({ chatContainerRef: chatContainerRef.value?.children })
    }
    const messageReceived = (msg: IMessage) => {
      console.log('Log z komponentu', { msg })
    }

    onMounted(() => {
      fetchMessages()
      store.dispatch(Action.listenForInserts, messageReceived)
    })

    return {
      chatMessages,
      randomColor,
      chatContainerRef,
      test,
    }
  },
})
</script>

<style lang="scss" scoped></style>
