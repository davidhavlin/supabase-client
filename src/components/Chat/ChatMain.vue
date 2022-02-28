<template>
  <div ref="chatContainerRef" class="mt-auto relative overflow-y-scroll p-3">
    <chat-message
      ref="msgRefs"
      v-for="message in chatMessages"
      :key="`chat-message-${message.id}`"
      :message="message"
      :colorClass="message.color ? `text-${message.color}` : 'text-red-500'"
      :icons="message.icons"
      @click="isChatMoreScrolled"
    />
  </div>
  <div class="over-chat pointer-events-none absolute top-0 left-0 w-full h-full">
    <div
      v-show="newMessageAlert"
      @click="scrollToBottom"
      class="absolute left-1/2 -translate-x-1/2 bg-slate-500 text-sm font-bold px-1 py-1 pointer-events-auto cursor-pointer bottom-0 rounded hover:text-white"
    >
      Nova správa
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
// import { supabase } from '../../plugins/supabase'
import { useMessagesStore } from '../../store/message/message.store'
import { IMessage } from '../../store/message/message.types'
import ChatMessage from './elements/ChatMessage.vue'
import { TChatMessage } from '../../store/message/message.types'

export default defineComponent({
  name: 'ChatMain',
  components: { ChatMessage },
  setup() {
    const store = useMessagesStore()
    const chatContainerRef = ref<HTMLElement | null>(null)

    const chatMessages = computed(() => store.chatMessages)

    const newMessageAlert = ref(false)
    const alertTimeout = ref<null | number>(null)
    const ALERT_DURATION = 6000
    const showNewMessageAlert = () => {
      alertTimeout.value && clearTimeout(alertTimeout.value)
      newMessageAlert.value = true
      alertTimeout.value = window.setTimeout(() => {
        newMessageAlert.value = false
      }, ALERT_DURATION)
    }

    const fetchMessages = async () => {
      if (chatMessages.value.length > 0) return
      await store.fetchMessages()
    }

    const scrollToBottom = () => {
      if (!chatContainerRef.value) return
      chatContainerRef.value.scrollTo({
        top: chatContainerRef.value.scrollHeight,
        behavior: 'smooth',
      })
    }

    const SPACE_PADDING = 50
    const isChatMoreScrolled = () => {
      const el = chatContainerRef.value
      if (!el) return
      return el.scrollHeight - el.scrollTop - SPACE_PADDING > el.clientHeight
    }

    const messageReceived = (msg: TChatMessage): void => {
      console.log('Log z komponentu', { msg }, isChatMoreScrolled())
      if (!chatContainerRef.value) return
      // chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
      nextTick(() => {
        if (isChatMoreScrolled()) {
          showNewMessageAlert()
        } else {
          scrollToBottom()
        }
      })
    }

    onMounted(async () => {
      await fetchMessages()
      scrollToBottom()
      store.listenSupabase(messageReceived)
    })

    return {
      chatMessages,
      chatContainerRef,
      newMessageAlert,
      isChatMoreScrolled,
      scrollToBottom,
    }
  },
})
</script>

<style scoped>
.over-chat {
  height: calc(100% - 150px);
}
</style>
