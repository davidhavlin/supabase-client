<template>
  <div class="text-lg text-left text-slate-200 mb-2">
    <div class="inline-block">
      <div class="flex flex-row items-center">
        <IconRemove
          v-if="msgDeletable[message.id] || userStore.user?.role === 'ADMIN'"
          @click="removeMessage(message.id)"
          class="w-4 h-4 cursor-pointer text-slate-600 hover:text-red-500 mr-1"
        />

        <div v-if="icons && icons.length > 0" class="flex flex-row items-center">
          <i
            v-for="(icon, i) in icons"
            :key="`icon-${icon}`"
            class="text-base w-6 h-6 rounded-md flex items-center justify-center"
            :class="[icon, colorClass, i && 'mr-1']"
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

<script lang="ts" setup>
import { computed } from 'vue'
import { IMessage } from '../../../store/message/message.types'
import { wordFilter } from '../../../main'
import { useMessagesStore } from '../../../store/message/message.store'
import IconRemove from '../../../assets/icons/IconRemove.vue'
import { useUiStore } from '../../../store/ui/ui.store'
import { useUserStore } from '../../../store/user/user.store'

interface Props {
  message: Required<IMessage>
  colorClass?: string
  icons?: string[] | null
}

const props = withDefaults(defineProps<Props>(), {
  colorClass: 'text-lime-500',
  icons: () => [],
})

const store = useMessagesStore()
const ui = useUiStore()
const userStore = useUserStore()

const removeMessage = async (id: number) => {
  const success = await store.removeMessage(id)
  success
    ? ui.showNotify({ type: 'success', label: 'Správa vymazaná' })
    : ui.showNotify({ type: 'error', label: 'Niečo sa pokazilo' })
}
const msgDeletable = computed(() => store.addedMessages)

const formatedTime = computed(() => {
  return new Date(props.message.created_at as Date).toLocaleString(undefined, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  })
})
</script>
