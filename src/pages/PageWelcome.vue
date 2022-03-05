<template>
  <div class="h-full flex flex-col items-center justify-center">
    <welcome-login />
    <div class="font-bold my-4 text-white">alebo</div>
    <welcome-entry />
  </div>
</template>

<script lang="ts" setup>
import WelcomeEntry from '../components/Welcome/WelcomeEntry.vue'
import WelcomeLogin from '../components/Welcome/WelcomeLogin.vue'
</script>
