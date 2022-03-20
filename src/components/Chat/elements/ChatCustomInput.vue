<template>
  <div ref="containerRef" class="relative">
    <chat-user-completion
      v-if="showCompletion"
      :style="{ left: leftPopup + 'px' }"
      :userCompletion="userCompletion"
      @select-option="onSelectOption"
      @close-popup="showCompletion = false"
    />
    <div
      ref="customInputRef"
      @input="onInput"
      @keypress.enter.prevent="$emit('onSend')"
      @focus="focused = true"
      @blur="focused = false"
      class="flex selection:bg-indigo-700 h-full text-left flex-row items-center justify-start w-full bg-slate-700 placeholder:text-slate-500 text-white font-bold focus:placeholder:text-transparent focus:bg-slate-800 px-4 py-2 rounded-r focus:shadow-outline outline-none"
      contenteditable="true"
      spellcheck="false"
      placeholder="Odoslať správu"
    >
      <!-- <span v-if="innerValue" class="ghost-element"></span> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import ChatUserCompletion from '../ChatUserCompletion.vue'

const props = defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue', 'onSend'])

const containerRef = ref<HTMLElement | null>(null)
const customInputRef = ref<HTMLElement | null>(null)

const userCompletion = computed(() => {
  const lastChar = innerValue.value[innerValue.value.length - 1]
  if ([' ', '@'].includes(lastChar) || lastChar === String.fromCharCode(160)) return undefined
  return innerValue.value
    .match(/(?:@)(\w+)/g)
    ?.pop()
    ?.substring(1)
    .toLowerCase()
})

const innerValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})

const onInput = (e: Event) => {
  const el = e.target as HTMLElement
  innerValue.value = el.innerText
}

const createGhostSpan = () => {
  const span = document.createElement('span')
  span.classList.add('ghost-element')
  customInputRef.value?.appendChild(span)
}
const removeGhostSpan = () => {
  const span = document.querySelector('.ghost-element')
  span?.remove()
}

const focusCustomInput = () => {
  const el = customInputRef.value
  if (!el) return

  el.focus()
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse()
  const sel = window.getSelection()
  if (!sel) return
  sel.removeAllRanges()
  sel.addRange(range)
}

const onSelectOption = (username: string) => {
  if (!customInputRef.value) return
  let sentence = innerValue.value + username

  if (userCompletion.value) {
    const length = userCompletion.value.length
    sentence = innerValue.value.substring(0, innerValue.value.length - length) + username
  }

  innerValue.value = customInputRef.value.innerText = sentence
  showCompletion.value = false
  createGhostSpan()
  focusCustomInput()
}

const POPUP_WIDTH = 224
const leftPopup = ref(0)
const showCompletion = ref(false)
const focused = ref(false)
watch(
  () => innerValue.value,
  (msg, oldMsg) => {
    if (!msg) {
      if (customInputRef.value) customInputRef.value.innerText = ''
      removeGhostSpan()
      return
    }
    if (customInputRef.value && !focused.value) customInputRef.value.innerText = msg
    if (msg && !oldMsg) {
      createGhostSpan()
    }
    setPopupDimensions()

    if (msg[msg.length - 1] === '@') {
      showCompletion.value = true
    }
    if (msg[msg.length - 1] === ' ' || msg[msg.length - 1] === String.fromCharCode(160)) {
      showCompletion.value = false
    }
  },
  { immediate: true }
)

const setPopupDimensions = () => {
  if (!containerRef.value) return
  const ghostEl = document.querySelector('.ghost-element')
  const { left: parentLeft } = containerRef.value.getBoundingClientRect()
  if (!ghostEl) return
  const { left } = ghostEl.getBoundingClientRect()
  if (left + POPUP_WIDTH > window.innerWidth) {
    leftPopup.value = left - POPUP_WIDTH - parentLeft
  } else {
    leftPopup.value = left - parentLeft
  }
}
</script>

<style scoped>
[contenteditable='true']:empty:not(:focus):before {
  content: attr(placeholder);
  color: #94a2b8;
}
</style>
