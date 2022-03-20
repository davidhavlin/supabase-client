<template>
  <footer>
    <div class="px-2 w-full">
      <div class="flex w-full">
        <div
          @click="addMessage"
          class="bg-primary-def cursor-pointer flex items-center px-4 py-2 border-r-0 rounded-l text-sm font-medium text-gray-800 select-none"
        >
          <IconChat class="text-white" />
        </div>
        <div class="flex-1">
          <chat-custom-input v-model="message" @on-send="addMessage" />
        </div>
      </div>
      <div class="flex flex-row justify-between flex-nowrap mt-2 text-slate-700">
        <chat-online-users :online-users-count="onlineUsersCount" />

        <div class="flex flex-row items-center">
          <chat-settings v-if="userStore.user" :user="userStore.user" />
          <button class="mr-2" v-else @click="$router.push({ name: 'PageWelcome' })">
            Prihlasiť sa
          </button>
          <button
            @click="addMessage"
            :disabled="!!disableCounter"
            class="ml-2 px-4 py-2 text-base font-semibold shadow-md rounded text-white bg-primary-def focus:outline-none hover:bg-primary-light"
            :class="{ 'bg-slate-500': !!disableCounter }"
          >
            Odoslať
            <span class="text-sm text-slate-300" v-show="disableCounter"
              >({{ disableCounter }})</span
            >
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import IconChat from '../../assets/icons/IconChat.vue'
import ChatSettings from './elements/ChatSettings.vue'
import { useMessagesStore } from '../../store/message/message.store'
import { useUserStore } from '../../store/user/user.store'
import { IMessage } from '../../store/message/message.types'
import { useUiStore } from '../../store/ui/ui.store'
import ChatOnlineUsers from './elements/ChatOnlineUsers.vue'
import ChatCustomInput from './elements/ChatCustomInput.vue'

const msgStore = useMessagesStore()
const userStore = useUserStore()
const ui = useUiStore()

const onlineUsersCount = computed(() => (userStore.onlineUsers ? userStore.onlineUsers.length : 0))

const message = computed({
  get: () => msgStore.inputMessage,
  set: (val: string) => {
    msgStore.inputMessage = val
  },
})

const disableCounter = computed(() => msgStore.afterMessageCounter)

const addMessage = () => {
  if (!userStore.user || disableCounter.value) {
    !userStore.user &&
      ui.showNotify({ label: 'Pre odoslanie správy sa musíš prihlásiť', type: 'warning' })
    return
  }
  const newMsg: IMessage = {
    content: message.value,
    icons: userStore.user.icons || [],
    username: userStore.user.username,
    user_id: userStore.user.id || null,
    anonym_id: userStore.user.anonym_id || null,
    color: userStore.user.color,
  }
  if (!message.value) return
  msgStore.createMessage(newMsg)
  message.value = ''
}
</script>
