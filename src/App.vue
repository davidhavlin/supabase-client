<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserStore } from './store/user/user.store'

const STORAGE_KEY = 'chat-user'

const userStore = useUserStore()
onMounted(async () => {
  console.log('ON BEFORE MOUNT')

  await userStore.checkIfUserIsLogged()
})
// userStore.$onAction(({ name, args, after, onError }) => {
//   console.log('Spustila sa USER_STORE akcia s nazvom: ', name, { args })
//   after((res) => {
//     if (name === 'setUser') {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(res))
//     }
//   })
// })
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
