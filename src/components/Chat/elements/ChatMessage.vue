<template>
  <div class="flex flex-row items-center text-lg text-slate-200 mb-2">
    <div v-if="icons.length > 0">
      <i v-for="icon in icons" :key="`icon-${icon}`" class="text-base" :class="icon"></i>
    </div>
    <div class="font-bold" :class="colorClass">{{ message.username }}:</div>
    <div class="ml-2 font-medium">{{ message.content }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IMessage } from '../../../store/message/message.types'

export default defineComponent({
  name: 'ChatMessage',
  props: {
    message: { type: Object as PropType<IMessage>, required: true },
    colorClass: { type: String, default: 'text-lime-500' },
    icons: { type: Array as PropType<string[]>, default: [] },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
