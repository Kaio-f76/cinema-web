<template>
  <div id="app" class="min-h-screen bg-[#0A0D0C] text-[#F2F2F2] font-['Inter',sans-serif]">

    <!-- HEADER -->
    <header class="bg-[#131516] border-b border-[#252829] px-8 py-4 flex items-center justify-between">

      <!-- ESQUERDA - LOGO -->
      <div class="flex items-center gap-3">
        <!-- Ícone com fundo verde, contorno arredondado suave e cor branca -->
        <div class="bg-[#2FA36A] p-1 rounded-lg flex items-center justify-center border border-[#27A35F]">
          <Film class="w-7 h-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold" style="font-family: 'Poppins', sans-serif;">
          CinemaMax
        </h1>
      </div>

      <!-- CENTRO - NAVEGAÇÃO -->
      <div class="flex items-center gap-6">
        
        <!-- INÍCIO (verde) -->
        <router-link
          to="/"
          class="bg-[#2FA36A] px-5 py-2 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
        >
          Início
        </router-link>

        <!-- FILMES (redireciona para login se não estiver logado) -->
        <router-link
          v-if="usuario"
          to="/filmes"
          class="bg-[#1A1C1E] border border-[#252829] px-5 py-2 rounded-lg hover:bg-[#252829] transition"
        >
          Filmes
        </router-link>

        <router-link
          v-else
          to="/login"
          class="bg-[#1A1C1E] border border-[#252829] px-5 py-2 rounded-lg hover:bg-[#252829] transition"
        >
          Filmes
        </router-link>

      </div>

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
    <main class="px-6 py-10">
      <router-view />
    </main>

  </div>
</template>

<script setup lang="ts">
import { Film, LogOut, User } from 'lucide-vue-next'
import { useUsuario } from './composables/useUsuario'
import usuarioService from './services/usuarioService'
import { useRouter } from 'vue-router'

const { usuario, clearUsuario } = useUsuario()
const router = useRouter()

const handleLogout = async () => {
  await usuarioService.logout()
  clearUsuario()
  router.push('/login')
}
</script>
