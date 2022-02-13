<template>
  <div class="bg-red mt-auto p-3">
    <chat-message
      v-for="message in chatMessages"
      :key="`chat-message-${message.id}`"
      :message="message"
      :colorClass="randomColor()"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '../../store'
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

    const randomColor = () => {
      const randomIndex = Math.floor(Math.random() * colors.length)
      return colors[randomIndex]
    }

    const chatMessages = computed(() => store.state.chatMessages)

    return {
      chatMessages,
      randomColor,
    }
  },
})
</script>

<style lang="scss" scoped></style>
