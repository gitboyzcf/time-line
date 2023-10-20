import { createApp } from 'vue'
import App from './App.vue'
import TimeLine from '@/components/TimeLine/index.js'

const app = createApp(App)

app.use(TimeLine, { comName: 'TimeLine' })
app.mount('#app')
