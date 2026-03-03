import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Cadastro from '../views/Cadastro.vue'
import Login from '../views/Login.vue'
import Filmes from '../views/Filmes.vue'
import Salas from '../views/Salas.vue'
import Ingressos from '../views/Ingressos.vue'
import Sessoes from '../views/Sessoes.vue'
import usuarioService from '../services/usuarioService'
import { useUsuario } from '../composables/useUsuario'


const routes = [
    { path: '/', name: 'Welcome', component: Welcome },
    { path: '/cadastro', name: 'Cadastro', component: Cadastro },
    { path: '/login', name: 'Login', component: Login },
    { path: '/filmes', name: 'Filmes', component: Filmes, meta: { requiresAuth: true } },
    { path: '/salas', name: 'Salas', component: Salas, meta: { requiresAuth: true } },
    { path: '/sessoes', name: 'Sessoes', component: Sessoes, meta: { requiresAuth: true } },
    { path: '/ingressos/:sessaoId', name: 'Ingressos', component: Ingressos, meta: { requiresAuth: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            const user = await usuarioService.getUsuario() // chama /api/usuarios/me
            const { setUsuario } = useUsuario()
            setUsuario(user) // persiste o usuário no state reativo
            next()
        } catch (err: any) {
            if (err.response?.status === 440) {
                alert("Sessão expirada ou não iniciada. Faça login novamente.")
                return next("/login")
            }
            return next("/login")
        }
    } else {
        next()
    }
})
export default router




