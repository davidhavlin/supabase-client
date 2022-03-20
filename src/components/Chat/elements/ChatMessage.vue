<template>
  <div v-if="blocked" class="italic" id="blocked">
    Správa od blokovaného uživateľa,
    <span :title="message.username" @click="toggleBlockUser" class="underline cursor-pointer"
      >odblokovať</span
    >
  </div>

  <div v-else class="text-lg text-left text-slate-200 mb-2">
    <div class="inline-block">
      <div class="flex flex-row items-center">
        <IconRemove
          v-if="showRemoveIcon"
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
        <chat-user-options
          :message="message"
          :colorClass="colorClass"
          @toggleBlockUser="toggleBlockUser"
        >
          <div class="font-bold cursor-pointer" :class="colorClass">
            {{ message.username }}
          </div>
        </chat-user-options>
        <span>:</span>
      </div>
    </div>
    <div
      class="ml-3 inline font-medium text-left tooltip"
      :class="{ 'align-top': showRemoveIcon, 'bg-slate-800': isUserMentioned }"
      :data-tip="formatedTime"
      v-html="serializedContent"
      @click="onClickTagged"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { IMessage } from '../../../store/message/message.types'
import { wordFilter } from '../../../main'
import { useMessagesStore } from '../../../store/message/message.store'
import IconRemove from '../../../assets/icons/IconRemove.vue'
import { useUiStore } from '../../../store/ui/ui.store'
import { useUserStore } from '../../../store/user/user.store'
import ChatUserOptions from './ChatUserOptions.vue'

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

const blocked = computed(() =>
  userStore.blockedUsers?.has(props.message.user_id || props.message.username)
)
const toggleBlockUser = () => {
  if (!userStore.blockedUsers) return
  const blockedUser = props.message.user_id || props.message.username
  if (userStore.blockedUsers.has(blockedUser)) {
    userStore.blockedUsers.delete(blockedUser)
  } else {
    userStore.blockedUsers.add(blockedUser)
  }
  localStorage.setItem('blocked-users', JSON.stringify(Array.from(userStore.blockedUsers)))
}

const showRemoveIcon = computed(
  () => msgDeletable.value[props.message.id] || userStore.user?.role === 'ADMIN'
)

const isUserMentioned = ref(false)
const serializedContent = computed(() => {
  const username = userStore.user?.username
  let content = props.message.content
  if (username && content.includes(`@${username}`)) {
    isUserMentioned.value = true

    content = props.message.content.replace(
      `@${username}`,
      `<span id="highlight" class="text-slate-800 cursor-pointer bg-primary-def font-bold">@${username}</span>`
    )
  }

  return wordFilter.clean(content)
})

const onClickTagged = (e: Event) => {
  const span = e.target as HTMLElement
  if (span && span.id === 'highlight') {
    const username = span.textContent
    store.inputMessage += username
  }
}
</script>
