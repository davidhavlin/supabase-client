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
          <chat-input v-model="message" @addMessage="addMessage" />
        </div>
      </div>
      <div class="flex flex-row justify-between flex-nowrap mt-2 text-slate-700">
        <div class="flex flex-row font-bold">
          <span>0</span> <IconUsers class="ml-1 text-slate-700" />
        </div>

        <div class="flex flex-row items-center">
          <chat-settings />
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

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import IconChat from '../../assets/icons/IconChat.vue'
import IconOptions from '../../assets/icons/IconOptions.vue'
import IconUsers from '../../assets/icons/IconUsers.vue'
import ChatSettings from './elements/ChatSettings.vue'
import ChatInput from './elements/ChatInput.vue'
import { useMessagesStore } from '../../store/message/message.store'
import { useUserStore } from '../../store/user/user.store'
import { IMessage } from '../../store/message/message.types'

export default defineComponent({
  name: 'ChatFooter',
  components: { IconChat, IconOptions, IconUsers, ChatSettings, ChatInput },
  setup() {
    const msgStore = useMessagesStore()
    const userStore = useUserStore()

    const message = ref('')

    const disableCounter = computed(() => msgStore.afterMessageCounter)

    const addMessage = () => {
      if (!userStore.user || disableCounter.value) {
        // show notify
        return
      }
      const newMsg: IMessage = {
        content: message.value,
        icons: userStore.user.icons,
        username: userStore.user.username,
        color: userStore.user.color,
      }
      if (!message.value) return
      msgStore.createMessage(newMsg)
      message.value = ''
    }

    return {
      addMessage,
      message,
      disableCounter,
    }
  },
})
</script>
