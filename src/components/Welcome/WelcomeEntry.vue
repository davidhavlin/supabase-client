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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user/user.store'
import { IUser } from '../../store/user/user.types'

const STORAGE_KEY = 'chat-user'

const userStore = useUserStore()
const router = useRouter()
const username = ref('')

const user = computed(() => userStore.user)
const anonymData = ref(null)

const onEntry = () => {
  if (!username.value) return
  // todo later set up anonym if its in localStorage
  const anonymUser = {
    username: username.value,
    icons: [],
    color: '',
  }

  userStore.setAnonymUser(anonymUser)
  // router.push({ name: 'PageChat' })
}

onMounted(() => {
  username.value = user.value ? user.value.username : ''

  const data = localStorage.getItem('anonym_user')
  if (data) {
    anonymData.value = JSON.parse(data)
  }
})
</script>

<style lang="scss" scoped></style>
