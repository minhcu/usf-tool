import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';

import './styles.css';
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(Antd)

app.mount('#app')
