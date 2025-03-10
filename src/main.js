import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import "@mdi/font/css/materialdesignicons.css";

// Vuetify
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
})
const app = createApp(App);
app.use(pinia).use(router).use(vuetify).mount('#app')

