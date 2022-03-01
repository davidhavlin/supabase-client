<template>
  <transition name="notify" @after-leave="onAfterLeave">
    <div
      v-show="notify.visible"
      @click="onClickNotify"
      class="notify flex w-full absolute left-1/2 z-[1000] bottom-4 max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md"
    >
      <div :class="`bg-${status[type]}`" class="flex items-center justify-center w-12">
        <svg
          class="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
          />
        </svg>
      </div>

      <div class="px-4 py-2 -mx-3">
        <div class="mx-3 text-left">
          <span :class="`text-${status[type]}`" class="font-semibold capitalize">{{ type }}</span>
          <p class="text-sm text-gray-600">{{ notify.data?.label }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useUiStore } from '../../store/ui/ui.store'

export default defineComponent({
  name: 'GlobalNotify',
  setup() {
    const uiStore = useUiStore()

    const status = {
      success: 'emerald-500',
      info: 'blue-500',
      error: 'red-500',
      warning: 'yellow-500',
    }

    const notify = computed(() => uiStore.notify)

    const closeTimeout = ref<null | NodeJS.Timeout>(null)
    const closeAfterTime = () => {
      closeTimeout.value = setTimeout(() => {
        uiStore.notify.visible = false
      }, 3000)
    }

    const onAfterLeave = () => {
      uiStore.hideNotify()
    }

    const onClickNotify = () => {
      uiStore.notify.visible = false
      closeTimeout.value && clearTimeout(closeTimeout.value)
    }

    const type = computed(() => notify.value.data?.type || 'info')

    watch(
      () => notify.value.visible,
      (visible) => {
        if (visible) {
          closeAfterTime()
        }
      }
    )

    return {
      notify,
      status,
      type,
      onAfterLeave,
      onClickNotify,
    }
  },
})
</script>

<style scoped>
.notify {
  transform: translate(-50%, 0%);
}

.notify-enter-active,
.notify-leave-active {
  transition: all 0.5s;
}

.notify-enter-from,
.notify-leave-to {
  opacity: 0;
  transform: translate(-50%, 130%);
}
</style>
