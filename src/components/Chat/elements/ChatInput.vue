<template>
  <input
    id="pretext-input"
    class="w-full bg-slate-700 placeholder:text-slate-500 text-white font-bold focus:placeholder:text-white focus:bg-slate-800 px-4 py-2 rounded-r focus:shadow-outline outline-none"
    type="text"
    placeholder="Odoslať správu"
    v-model="message"
    @keydown.enter="$emit('addMessage')"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'ChatInput',
  props: {
    modelValue: { type: String, required: true },
  },
  setup(props, { emit }) {
    const message = computed({
      get: () => props.modelValue,
      set: (val: string) => {
        emit('update:modelValue', val)
      },
    })
    return {
      message,
    }
  },
})
</script>

<style lang="scss" scoped></style>
