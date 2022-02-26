import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { createPinia } from 'pinia'
import Filter from 'bad-words'
import skBadWords from './utils/bad-words'

const wordFilter = new Filter()
wordFilter.addWords(...skBadWords)

const clickOutside = {
  beforeMount: (el: any, binding: any, vnode: any) => {
    el.clickOutsideEvent = (event: Event) => {
      // here I check that click was outside the el and his children
      if (
        !(
          el === event.target ||
          el.contains(event.target) ||
          el.parentElement.contains(event.target)
        )
      ) {
        binding.value()
      }
    }

    document.addEventListener('click', el.clickOutsideEvent, { capture: true })
  },
  unmounted: (el: any) => {
    document.removeEventListener('click', el.clickOutsideEvent, { capture: true })
  },
}

const app = createApp(App)
app.directive('click-outside', clickOutside)
app.use(createPinia())
app.use(router)

app.mount('#app')
export default app
export { wordFilter }
