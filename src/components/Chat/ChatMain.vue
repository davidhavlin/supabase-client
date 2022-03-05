<template>
  <div ref="chatContainerRef" class="chat-container mt-auto relative overflow-y-scroll p-3">
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
    <transition name="fade">
      <div
        v-show="newMessageAlert"
        @click="scrollToBottom"
        class="absolute left-1/2 -translate-x-1/2 bg-slate-500 text-sm font-bold px-1 py-1 pointer-events-auto cursor-pointer bottom-0 rounded hover:text-white"
      >
        Nova správa
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useMessagesStore } from '../../store/message/message.store'
import ChatMessage from './elements/ChatMessage.vue'

const store = useMessagesStore()
const chatContainerRef = ref<HTMLElement | null>(null)

const chatMessages = computed(() => store.chatMessages)

const scrollOrNotify = () => {
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
watch(() => chatMessages.value, scrollOrNotify)

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

const scrollToBottom = () => {
  if (!chatContainerRef.value) return
  newMessageAlert.value = false
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

onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.over-chat {
  height: calc(100% - 150px);
}
.chat-container::-webkit-scrollbar {
  width: 10px;
  /* height: 20px; */
}

.chat-container::-webkit-scrollbar-track {
  background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #0cc380;
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: #05fda2;
}
</style>
