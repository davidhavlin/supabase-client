<template>
  <div ref="chatContainerRef" class="chat-container mt-auto relative overflow-y-scroll p-3">
    <div
      v-for="(message, index) in filteredMessages"
      :key="`chat-message-${message.id}-${index}`"
      :class="{ 'last-message': index === filteredMessages.length - 1 }"
    >
      <div class="text-slate-600 text-sm" v-if="message.welcome">
        <span class="font-bold"> {{ message.username }}</span> sa pripojil..
      </div>
      <chat-message
        v-else
        ref="msgRefs"
        :message="message"
        :colorClass="message.color ? `text-${message.color}` : 'text-red-500'"
        :icons="message.icons"
      />
    </div>
  </div>
  <div class="over-chat pointer-events-none absolute top-0 left-0 w-full h-full">
    <transition name="fade">
      <div
        v-show="newMessageAlert"
        @click="scrollToBottom"
        class="absolute left-1/2 -translate-x-1/2 bg-slate-500 text-sm font-bold px-1 py-1 pointer-events-auto cursor-pointer bottom-0 rounded flex flex-row items-center hover:text-white"
      >
        <span class="block">Nová správa</span> <IconArrow class="ml-1" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useMessagesStore } from '../../store/message/message.store'
import ChatMessage from './elements/ChatMessage.vue'
import IconArrow from '../../assets/icons/IconArrow.vue'
import { TChatMessage } from '../../store/message/message.types'
import { useUserStore } from '../../store/user/user.store'

const store = useMessagesStore()
const userStore = useUserStore()
const chatContainerRef = ref<HTMLElement | null>(null)

const chatMessages = computed(() => store.chatMessages)
const filteredMessages = computed(() => {
  const arr: TChatMessage[] = []

  let blockUser: string | null = null
  chatMessages.value.forEach((msg) => {
    if (isBlocked(msg)) {
      const identify = msg.user_id || msg.username

      if (!blockUser || blockUser !== identify) {
        blockUser = identify
        arr.push(msg)
      }
    } else {
      blockUser = null
      arr.push(msg)
    }
  })

  return userStore.hideAnonymMessages
    ? arr.filter((msg) => {
        return !!msg.user_id
      })
    : arr
})

const firstLoad = ref(true)
const scrollOrNotify = (newMessages: TChatMessage[], oldMessages: TChatMessage[]) => {
  if (newMessages.length < oldMessages.length) return
  if (!newMessages) return
  nextTick(() => {
    if (firstLoad.value) {
      scrollToBottom()
      return
    }
    if (isChatMoreScrolled()) {
      showNewMessageAlert()
    } else {
      scrollToBottom()
    }
  })
}
watch(() => store.chatMessages, scrollOrNotify, { deep: true })

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
  const lastItem = document.querySelector('.last-message')
  // console.log('scrollToBottom', chatContainerRef.value, lastItem, chatMessages.value)
  if (lastItem) {
    firstLoad.value = false
    lastItem.scrollIntoView({ behavior: 'smooth' })
  }

  // if (!chatContainerRef.value) return
  newMessageAlert.value = false
  // chatContainerRef.value.scrollTo({
  //   top: chatContainerRef.value.scrollHeight,
  //   behavior: 'smooth',
  // })
}

const isBlocked = (message: TChatMessage) => {
  return userStore.blockedUsers?.has(message.user_id || message.username)
}

const SPACE_PADDING = 50
const isChatMoreScrolled = () => {
  const el = chatContainerRef.value
  if (!el) return
  return el.scrollHeight - el.scrollTop - SPACE_PADDING > el.clientHeight
}

onMounted(() => {
  // nextTick(() => {
  //   scrollToBottom() // TODO
  // })
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
