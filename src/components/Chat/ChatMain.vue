<template>
  <div ref="chatContainerRef" class="chat-container mt-auto relative overflow-y-scroll p-3">
    <div
      v-for="(message, index) in filteredMessages"
      :key="`chat-message-${message.id}-${index}`"
      :class="{
        'last-message': index === filteredMessages.length - 1,
        'first-message': index === 0,
        'before-loaded-message': index === beforeIndex,
      }"
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
  <div class="over-chat mt-3 h-[calc(100%-110px)] pointer-events-none absolute top-0 left-0 w-full">
    <transition name="fade">
      <button
        v-show="showLoadMore"
        @click="loadMoreMessages"
        class="absolute left-1/2 -translate-x-1/2 bg-indigo-700 text-sm font-bold px-1 py-1 pointer-events-auto cursor-pointer top-0 rounded flex flex-row items-center text-slate-900 hover:text-white"
      >
        <span class="block">Načítať staršie správy</span> <IconLoad class="ml-1" />
      </button>
    </transition>
    <transition name="fade">
      <button
        v-show="newMessageAlert"
        @click="scrollToEl('last-message')"
        class="absolute left-1/2 -translate-x-1/2 bg-indigo-700 text-sm font-bold px-1 py-1 pointer-events-auto cursor-pointer bottom-0 rounded flex flex-row items-center text-slate-900 hover:text-white"
      >
        <span class="block">Nová správa</span> <IconArrow class="ml-1" />
      </button>
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
import IconLoad from '../../assets/icons/IconLoad.vue'

const store = useMessagesStore()
const userStore = useUserStore()
const chatContainerRef = ref<HTMLElement | null>(null)

const beforeCount = ref<null | number>(null)
const beforeIndex = computed(() => {
  if (!beforeCount.value) return null
  return store.chatMessages.length - beforeCount.value
})
const loadMoreMessages = async () => {
  beforeCount.value = store.chatMessages.length
  await store.fetchMoreMessages()
  nextTick(() => {
    scrollToEl('before-loaded-message', 'auto', 'center')
  })
}

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

  return userStore.hideAnonymMessages ? arr.filter((msg) => !!msg.user_id) : arr
})

const firstLoad = ref(true)
const scrollOrNotify = (newMessages: TChatMessage[], oldMessages: TChatMessage[]) => {
  if (newMessages.length < oldMessages.length) return
  if (!newMessages) return
  nextTick(() => {
    if (firstLoad.value) {
      scrollToEl('last-message')
      return
    }
    if (viewLocation.value !== 'BOTTOM') {
      showNewMessageAlert()
    } else {
      scrollToEl('last-message')
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

const scrollToEl = (
  className: string,
  behavior: ScrollBehavior = 'smooth',
  block: ScrollLogicalPosition = 'start'
) => {
  const lastItem = document.querySelector(`.${className}`)
  if (lastItem) {
    firstLoad.value = false
    lastItem.scrollIntoView({ behavior, block })
  }
  newMessageAlert.value = false
}

const isBlocked = (message: TChatMessage) => {
  return userStore.blockedUsers?.has(message.user_id || message.username)
}

const viewLocation = ref<'TOP' | 'BOTTOM' | 'CENTER' | null>(null)
const observer = ref<IntersectionObserver | null>(null)
const setObserver = () => {
  let options = {
    root: chatContainerRef.value,
    rootMargin: '0px 0px 100px 0px',
    threshold: 1,
  }

  observer.value = new IntersectionObserver((entries, observer) => {
    for (const { target, isIntersecting, intersectionRatio } of entries) {
      if (target.className === 'last-message' && isIntersecting) {
        viewLocation.value = 'BOTTOM'
      } else if (target.className === 'first-message' && isIntersecting) {
        viewLocation.value = 'TOP'
      } else {
        viewLocation.value = 'CENTER'
      }
    }
  }, options)
}
const showLoadMore = computed(
  () => viewLocation.value === 'TOP' && store.chatMessages.length < store.countAllMessages
)
const observeElements = () => {
  if (!observer.value) return
  const first = document.querySelector('.first-message')
  const last = document.querySelector('.last-message')

  first && observer.value.observe(first)
  last && observer.value.observe(last)
}
watch(
  () => filteredMessages.value,
  (msgs) => {
    if (observer.value) {
      observer.value.disconnect()
    }
    nextTick(() => {
      if (msgs.length === 0) return

      setObserver()
      observeElements()
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.chat-container::-webkit-scrollbar {
  width: 10px;
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
