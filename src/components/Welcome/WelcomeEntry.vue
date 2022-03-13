<template>
  <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md dark:bg-gray-800">
    <div class="mb-4 w-full">
      <label class="block mb-2 text-sm font-bold text-left text-white" for="pretext-input"
        >Zadaj jednorazovy nick</label
      >

      <div class="flex justify-between w-full">
        <div class="flex-1">
          <input
            id="pretext-input"
            v-model="username"
            class="w-full border font-bold bg-slate-500 focus:bg-white placeholder:text-white px-4 py-2 rounded-lg focus:shadow-outline outline-none"
            :class="{ 'bg-white': username }"
            type="text"
            placeholder="@nick"
          />
        </div>
        <button
          @click="onEntry"
          class="inline-flex items-center ml-3 justify-center cursor-pointer px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-primary-def hover:bg-primary-dark"
        >
          Vstup
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '../../store/user/user.store'
import { EStorageKey } from '../../store/user/user.types'

const STORAGE_KEY = 'chat-user'

interface LocalStorageAnonymUser {
  username: string
  anonym_id: number
  color: string
  icons: string[]
  session_id: string
}

const userStore = useUserStore()
const username = ref('')

const anonymData = ref<null | LocalStorageAnonymUser>()

const onEntry = () => {
  if (!username.value) return

  const anonymUser = {
    ...anonymData.value,
    username: username.value,
  }

  userStore.setAnonymUser(anonymUser)
}

onMounted(() => {
  const data = localStorage.getItem(EStorageKey.ANONYM_USER)

  if (data) {
    anonymData.value = JSON.parse(data) as LocalStorageAnonymUser
    username.value = anonymData.value.username
  }
})
</script>
