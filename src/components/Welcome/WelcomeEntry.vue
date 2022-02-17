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
            type="text"
            placeholder="@nick"
          />
        </div>
        <button
          @click="onEntry"
          class="inline-flex items-center ml-3 justify-center cursor-pointer px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Vstup
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../store'
import { UserMutation } from '../../store/module-user/mutations'
import { IUser } from '../../store/module-user/state'

const STORAGE_KEY = 'chat-user'

export default defineComponent({
  name: 'WelcomeEntry',
  setup() {
    const store = useStore()
    const router = useRouter()
    const username = ref('')

    const user = computed(() => store.state.user.user)

    const onEntry = () => {
      if (!username.value) return
      const newUser: IUser = user.value
        ? { ...user.value, username: username.value }
        : {
            username: username.value,
            colorClass: '',
            icons: [],
          }
      store.commit(UserMutation.SET_USER, newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))

      router.push({ name: 'PageChat' })
    }

    onMounted(() => {
      const savedUser = localStorage.getItem(STORAGE_KEY)
      if (savedUser) {
        let user: IUser = JSON.parse(savedUser)
        store.commit(UserMutation.SET_USER, user)
        username.value = user.username
      }
    })

    return { onEntry, username }
  },
})
</script>

<style lang="scss" scoped></style>
