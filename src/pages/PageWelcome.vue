<template>
  <div class="h-full flex flex-col items-center justify-center">
    <welcome-login />
    <!-- <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
      <div class="inline-flex rounded-md shadow">
        <a
          class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Get started
        </a>
      </div>
      <div class="ml-3 inline-flex rounded-md shadow">
        <a
          class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
        >
          Learn more
        </a>
      </div>
    </div> -->
    <div class="font-bold my-4 text-white">alebo</div>
    <welcome-entry />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WelcomeEntry from '../components/Welcome/WelcomeEntry.vue'
import WelcomeLogin from '../components/Welcome/WelcomeLogin.vue'

export default defineComponent({
  name: 'PageWelcome',
  components: { WelcomeEntry, WelcomeLogin },
})
</script>

<style lang="scss" scoped></style>
