<template>
  <chat-user-completion
    :style="{ left: leftPopup + 'px' }"
    v-show="showCompletion"
    @selectOption="onSelectOption"
  />
  <div
    ref="customInputRef"
    @input="onInput"
    @blur="onBlur"
    class="flex selection:bg-indigo-700 h-full text-left flex-row items-center justify-start w-full bg-slate-700 placeholder:text-slate-500 text-white font-bold focus:placeholder:text-transparent focus:bg-slate-800 px-4 py-2 rounded-r focus:shadow-outline outline-none"
    contenteditable="true"
    spellcheck="false"
    placeholder="Odoslať správu"
  >
    <span ref="ghostRef" v-if="innerValue" class="ghost-element"></span>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import ChatUserCompletion from '../ChatUserCompletion.vue'

const props = defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])
const customInputRef = ref<HTMLElement | null>(null)

const skuska = () => {
  if (!customInputRef.value) return
  customInputRef.value.innerText = 'kokot'
}

const innerValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})

const onInput = (e: Event) => {
  console.log(' on input')

  const el = e.target as HTMLElement
  innerValue.value = el.innerText
}

const onBlur = () => {
  setTimeout(() => {
    showCompletion.value = false
  }, 100)
}

const onSelectOption = (username: string) => {
  if (!customInputRef.value) return

  customInputRef.value.innerText += username + ' '
  innerValue.value = customInputRef.value.innerText
  // nextTick(() => {
  //   customInputRef.value!.focus()
  // })
}

const POPUP_WIDTH = 224
const leftPopup = ref(0)
const showCompletion = ref(false)
const ghostRef = ref<HTMLElement | null>(null)
watch(
  () => innerValue.value,
  (msg, oldMsg) => {
    setPopupDimensions()

    if (msg[msg.length - 1] === '@') {
      showCompletion.value = true
    }
    if (msg[msg.length - 1] === ' ' || msg[msg.length - 1] === String.fromCharCode(160)) {
      showCompletion.value = false
    }
  }
)

const setPopupDimensions = () => {
  if (!ghostRef.value) return
  const { left } = ghostRef.value.getBoundingClientRect()
  if (left + POPUP_WIDTH > window.innerWidth) {
    leftPopup.value = left - POPUP_WIDTH
  } else {
    leftPopup.value = left
  }
}
</script>

<style scoped>
[contenteditable='true']:empty:not(:focus):before {
  content: attr(placeholder);
  color: #94a2b8;
}
</style>
