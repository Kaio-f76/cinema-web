import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Cadastro from '../views/Cadastro.vue'
import Login from '../views/Login.vue'

const routes = [
    { path: '/', name: 'Welcome', component: Welcome },
    { path: '/cadastro', name: 'Cadastro', component: Cadastro },
    { path: '/login', name: 'Login', component: Login },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
