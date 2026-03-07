<template>
  <div id="app" class="min-h-screen bg-[#0A0D0C] text-[#F2F2F2] font-['Inter',sans-serif]">

    <!-- HEADER -->
    <header class="bg-[#131516] border-b border-[#252829] px-8 py-4 flex items-center justify-between">

      <!-- ESQUERDA - LOGO -->
      <div class="flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#2FA36A"/>
          <!-- Rolo de filme -->
          <circle cx="20" cy="20" r="10" stroke="white" stroke-width="2" fill="none"/>
          <circle cx="20" cy="20" r="4" fill="white"/>
          <!-- Perfurações do rolo -->
          <circle cx="20" cy="11" r="1.5" fill="white"/>
          <circle cx="20" cy="29" r="1.5" fill="white"/>
          <circle cx="11" cy="20" r="1.5" fill="white"/>
          <circle cx="29" cy="20" r="1.5" fill="white"/>
          <circle cx="13.6" cy="13.6" r="1.5" fill="white"/>
          <circle cx="26.4" cy="26.4" r="1.5" fill="white"/>
          <circle cx="26.4" cy="13.6" r="1.5" fill="white"/>
          <circle cx="13.6" cy="26.4" r="1.5" fill="white"/>
        </svg>
        <h1 class="text-2xl font-bold" style="font-family: 'Poppins', sans-serif;">
          CinemaMax
        </h1>
      </div>

      <!-- CENTRO - NAVEGAÇÃO -->
      <nav class="flex items-center gap-2">
        <router-link
          to="/"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="$route.path === '/' ? 'bg-[#2FA36A] text-white' : 'text-[#A8AAAD] hover:bg-[#1A1C1E] hover:text-white'"
        >
          Início
        </router-link>

        <router-link
          :to="usuario ? '/filmes' : '/login'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="$route.path === '/filmes' ? 'bg-[#2FA36A] text-white' : 'text-[#A8AAAD] hover:bg-[#1A1C1E] hover:text-white'"
        >
          Filmes
        </router-link>

        <router-link
          v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'"
          to="/salas"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="$route.path === '/salas' ? 'bg-[#2FA36A] text-white' : 'text-[#A8AAAD] hover:bg-[#1A1C1E] hover:text-white'"
        >
          Salas
        </router-link>

        <router-link
          :to="usuario ? '/sessoes' : '/login'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="$route.path === '/sessoes' ? 'bg-[#2FA36A] text-white' : 'text-[#A8AAAD] hover:bg-[#1A1C1E] hover:text-white'"
        >
          Sessões
        </router-link>

        <router-link
          v-if="usuario?.tipoUsuario === 'ADMINISTRADOR'"
          to="/relatorios"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="$route.path === '/relatorios' ? 'bg-[#2FA36A] text-white' : 'text-[#A8AAAD] hover:bg-[#1A1C1E] hover:text-white'"
        >
          Relatórios
        </router-link>
      </nav>

      <!-- DIREITA - LOGIN / LOGOUT -->
      <div class="flex items-center gap-4">

        <!-- ENTRAR -->
        <router-link
          v-if="!usuario"
          to="/login"
          class="flex items-center gap-2 bg-[#2FA36A] px-5 py-2 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
        >
          <User class="w-4 h-4" />
          Entrar
        </router-link>

        <!-- PERFIL + LOGOUT -->
        <router-link
          v-if="usuario"
          to="/minha-conta"
          class="flex items-center gap-2 bg-[#1A1C1E] border border-[#252829] px-4 py-2 rounded-lg hover:bg-[#252829] transition"
        >
          <User class="w-4 h-4 text-[#A8AAAD]" />
          <span class="text-sm font-medium">{{ usuario.nome?.split(' ')[0] }}</span>
        </router-link>

        <!-- LOGOUT -->
        <button
          v-if="usuario"
          @click="handleLogout"
          class="flex items-center gap-2 bg-[#EF4444] px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut class="w-4 h-4" />
          Logout
        </button>

      </div>

    </header>

    <!-- MAIN -->
    <main :class="$route.name === 'Welcome' ? '' : 'px-6 py-10'">
      <router-view />
    </main>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Film, LogOut, User } from 'lucide-vue-next'
import { useUsuario } from './composables/useUsuario'
import usuarioService from './services/usuarioService'
import { useRouter } from 'vue-router'

const { usuario, clearUsuario, fetchUsuario } = useUsuario()
const router = useRouter()

// Recarrega o usuário da sessão ao montar (ex: após F5)
onMounted(() => fetchUsuario())

const handleLogout = async () => {
  await usuarioService.logout()
  clearUsuario()
  router.push('/login')
}
</script>
