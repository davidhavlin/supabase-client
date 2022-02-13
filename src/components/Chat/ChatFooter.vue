<template>
  <footer>
    <div class="px-2 w-full">
      <div class="flex w-full">
        <div
          @click="addMessage"
          class="bg-blue-500 cursor-pointer flex items-center px-4 py-2 border-r-0 rounded-l text-sm font-medium text-gray-800 select-none"
        >
          <IconChat />
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
            class="ml-2 px-4 py-2 text-sm rounded text-white bg-blue-500 focus:outline-none hover:bg-blue-400"
          >
            Odoslať
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import IconChat from '../../assets/icons/IconChat.vue'
import IconOptions from '../../assets/icons/IconOptions.vue'
import IconUsers from '../../assets/icons/IconUsers.vue'
import { useStore } from '../../store'
import { Mutation } from '../../store/mutations'
import ChatSettings from './elements/ChatSettings.vue'
import ChatInput from './elements/ChatInput.vue'

export default defineComponent({
  name: 'ChatFooter',
  components: { IconChat, IconOptions, IconUsers, ChatSettings, ChatInput },
  setup() {
    const store = useStore()

    const message = ref('')

    const addMessage = () => {
      const newMessage = {
        id: new Date().valueOf(),
        content: message.value,
        username: 'test',
      }
      if (!message.value) return
      store.commit(Mutation.ADD_MESSAGE, newMessage)
      message.value = ''
    }

    return {
      addMessage,
      message,
    }
  },
})
</script>

<style lang="scss" scoped></style>
