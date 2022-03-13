<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useUserStore } from './store/user/user.store'

const userStore = useUserStore()
onMounted(async () => {
  await userStore.checkIfUserIsLogged()

  if (!userStore.user) {
    const data = localStorage.getItem('anonym_user')
    if (data) {
      userStore.setAnonymUser(JSON.parse(data))
    }
  }
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
