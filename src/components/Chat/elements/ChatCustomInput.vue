<template>
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
    class="flex selection:bg-indigo-700 h-full text-left flex-row items-center justify-start w-full bg-slate-700 placeholder:text-slate-500 text-white font-bold focus:placeholder:text-transparent focus:bg-slate-800 px-4 py-2 rounded-r focus:shadow-outline outline-none"
    contenteditable="true"
    spellcheck="false"
    placeholder="Odoslať správu"
  >
    <!-- <span v-if="innerValue" class="ghost-element"></span> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ChatUserCompletion from '../ChatUserCompletion.vue'

const props = defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])
const customInputRef = ref<HTMLElement | null>(null)

// onMounted(() => {
//   createGhostSpan()
// })

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
  let addedWord = username

  if (userCompletion.value) {
    const length = userCompletion.value.length
    if (addedWord.toLowerCase().startsWith(userCompletion.value)) {
      addedWord = username.substring(length)
    } else {
      //@e => delete and replace
    }
  }

  if (!customInputRef.value) return

  customInputRef.value.innerText += addedWord + ' '
  innerValue.value = customInputRef.value.innerText
  showCompletion.value = false
  createGhostSpan()
  focusCustomInput()
  // nextTick(() => {
  //   customInputRef.value!.focus()
  // })
}

const POPUP_WIDTH = 224
const leftPopup = ref(0)
const showCompletion = ref(false)
watch(
  () => innerValue.value,
  (msg, oldMsg) => {
    if (!msg) {
      removeGhostSpan()
      return
    }
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
  const ghostEl = document.querySelector('.ghost-element')
  if (!ghostEl) return
  const { left } = ghostEl.getBoundingClientRect()
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
