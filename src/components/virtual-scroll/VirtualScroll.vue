<template>
  <div class="vs-container" ref="containerRef" :style="{ height: `${parentHeight}px` }">
    <div class="vs-container__viewport" :style="{ height: `${totalHeight}px` }">
      <div class="vs-container__elevator" :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          class="vs-container__elevator-item"
          v-for="(item, i) in visibleItems"
          :key="`vs-elevator-item-${i}`"
        >
          <slot name="item" :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, PropType } from 'vue'

interface IItem {
  label: string
  value: string
}

export default defineComponent({
  name: 'VirtualScroll',
  props: {
    items: { type: Array as PropType<IItem[]>, required: true },
  },
  setup(props) {
    const containerRef = ref<HTMLElement | null>(null)
    const scrollTop = ref(0)

    const itemHeight = ref(30)
    const totalHeight = computed(() => props.items.length * itemHeight.value)

    const onScroll = (e: Event) => {
      if (!e.target) return
      return requestAnimationFrame(() => {
        scrollTop.value = (e.target as Element).scrollTop
      })
    }

    const OUTSIDE_ITEMS = 10
    const startNode = computed(() =>
      Math.max(0, Math.floor(scrollTop.value / itemHeight.value) - OUTSIDE_ITEMS)
    )

    const parentHeight = ref(0)
    const visibleNodeCount = computed(() =>
      Math.min(
        props.items.length - startNode.value,
        Math.ceil(parentHeight.value / itemHeight.value) + 2 * OUTSIDE_ITEMS
      )
    )

    const visibleItems = computed(() => {
      return props.items.slice(startNode.value, startNode.value + visibleNodeCount.value)
    })

    const offsetY = computed(() => startNode.value * itemHeight.value)

    onMounted(() => {
      const container = containerRef.value
      const item = document.querySelector('.vs-container__elevator-item')

      if (!container || !container.parentElement || !item) return

      parentHeight.value = container.parentElement.getBoundingClientRect().height
      itemHeight.value = item.getBoundingClientRect().height

      scrollTop.value = container.scrollTop

      container.addEventListener('scroll', onScroll)
    })

    onBeforeUnmount(() => {
      containerRef.value?.removeEventListener('scroll', onScroll)
    })

    return {
      itemHeight,
      containerRef,
      parentHeight,
      totalHeight,
      offsetY,
      visibleItems,
    }
  },
})
</script>

<style scoped>
.vs-container {
  overflow-y: auto;
}

.vs-container__viewport {
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.vs-container__elevator {
  will-change: transform;
}
</style>
