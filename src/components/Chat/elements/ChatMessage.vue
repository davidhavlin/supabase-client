<template>
  <div class="text-lg text-left text-slate-200 mb-2">
    <div class="inline-block">
      <div class="flex flex-row items-center">
        <IconRemove
          v-if="msgDeletable[message.id]"
          @click="removeMessage(message.id)"
          class="w-4 h-4 cursor-pointer text-slate-600 hover:text-red-500 mr-1"
        />

        <div v-if="icons.length > 0">
          <i
            v-for="icon in icons"
            :key="`icon-${icon}`"
            class="text-base w-6 h-6 rounded-md flex items-center justify-center mr-1"
            :class="[icon, colorClass]"
          ></i>
        </div>
        <div class="font-bold" :class="colorClass">{{ message.username }}</div>
        <span>:</span>
      </div>
    </div>
    <span class="ml-3 inline font-medium text-left tooltip" :data-tip="formatedTime">
      {{ wordFilter.clean(message.content) }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { IMessage } from '../../../store/message/message.types'
import { wordFilter } from '../../../main'
import { useMessagesStore } from '../../../store/message/message.store'
import IconRemove from '../../../assets/icons/IconRemove.vue'
import { useUiStore } from '../../../store/ui/ui.store'

export default defineComponent({
  name: 'ChatMessage',
  components: { IconRemove },
  props: {
    message: { type: Object as PropType<Required<IMessage>>, required: true },
    colorClass: { type: String, default: 'text-lime-500' },
    icons: { type: Array as PropType<string[]>, default: [] },
  },
  setup(props) {
    const store = useMessagesStore()
    const ui = useUiStore()

    const removeMessage = async (id: number) => {
      const success = await store.removeMessage(id)
      success
        ? ui.showNotify({ type: 'success', label: 'Správa vymazaná' })
        : ui.showNotify({ type: 'error', label: 'Niečo sa pokazilo' })
    }

    return {
      formatedTime: computed(() => {
        return new Date(props.message.created_at as Date).toLocaleString(undefined, {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          hour12: false,
          minute: '2-digit',
        })
      }),
      wordFilter,
      msgDeletable: computed(() => store.addedMessages),
      removeMessage,
    }
  },
})
</script>
