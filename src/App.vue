<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useUserStore } from './store/user/user.store'
import { IUser } from './store/user/user.types'
const STORAGE_KEY = 'chat-user'

export default defineComponent({
  name: 'App',
  setup() {
    const userStore = useUserStore()

    onMounted(() => {
      const savedUser = localStorage.getItem(STORAGE_KEY)
      if (savedUser) {
        let user: IUser = JSON.parse(savedUser)
        userStore.setUser(user)
      }
    })

    userStore.$onAction(({ name, args, after, onError }) => {
      console.log('Spustila sa USER_STORE akcia s nazvom: ', name, { args })

      after((res) => {
        if (name === 'setUser') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res))
        }
      })
    })
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
body {
  background: #3b81f6;
}
</style>
