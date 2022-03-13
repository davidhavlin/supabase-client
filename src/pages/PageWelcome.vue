<template>
  <div class="h-full flex items-center justify-center">
    <div class="relative flex flex-col items-center justify-center">
      <welcome-login />
      <div class="font-bold my-4 text-white">alebo</div>
      <welcome-entry />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import WelcomeEntry from '../components/Welcome/WelcomeEntry.vue'
import WelcomeLogin from '../components/Welcome/WelcomeLogin.vue'
import { useUiStore } from '../store/ui/ui.store'
import { useUserStore } from '../store/user/user.store'
const userStore = useUserStore()
const uiStore = useUiStore()
const router = useRouter()

const user = computed(() => userStore.user)
watch(
  () => user.value,
  (newUser) => {
    console.log({ newUser })
    newUser && router.push({ name: 'PageChat' })
  }
)
const loading = computed(() => uiStore.loading)
onBeforeMount(() => {
  if (user.value) {
    router.push({ name: 'PageChat' })
  }
})
</script>

<style scoped>
.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
