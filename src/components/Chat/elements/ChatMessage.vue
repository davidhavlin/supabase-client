<template>
  <div class="flex flex-row items-center text-lg text-slate-200 mb-2">
    <div v-if="icons.length > 0">
      <i v-for="icon in icons" :key="`icon-${icon}`" class="text-base" :class="icon"></i>
    </div>
    <div class="font-bold" :class="colorClass">{{ message.username }}:</div>
    <div class="ml-2 font-medium tooltip" :data-tip="formatedTime">
      {{ wordFilter.clean(message.content) }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { IMessage } from '../../../store/message/message.types'
import { wordFilter } from '../../../main'

export default defineComponent({
  name: 'ChatMessage',
  props: {
    message: { type: Object as PropType<IMessage>, required: true },
    colorClass: { type: String, default: 'text-lime-500' },
    icons: { type: Array as PropType<string[]>, default: [] },
  },
  setup(props) {
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
    }
  },
})
</script>
