import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { createPinia } from 'pinia'

const clickOutside = {
  beforeMount: (el: any, binding: any) => {
    el.clickOutsideEvent = (event: Event) => {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: (el: any) => {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

const app = createApp(App)
app.directive('click-outside', clickOutside)
app.use(createPinia())
app.use(router)

app.mount('#app')
export default app
