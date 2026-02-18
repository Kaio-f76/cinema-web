import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

// conecta o Vue Router
app.use(router)

app.mount('#app')
