<template>
  <div class="max-w-md mx-auto mt-20 bg-[#131516] border border-[#252829] rounded-xl p-8 shadow-lg">
    
    <div class="text-center mb-8">
      <User class="w-12 h-12 text-[#2FA36A] mx-auto mb-4" />
      <h2 class="text-2xl font-bold" style="font-family: 'Poppins', sans-serif;">
        Login
      </h2>
    </div>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
      />

      <input
        v-model="senha"
        type="password"
        placeholder="Senha"
        required
        class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]"
      />

      <button
        type="submit"
        class="bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] transition"
      >
        Entrar
      </button>

      <router-link to="/">
        <button
          type="button"
          class="w-full bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition"
        >
          Cancelar
        </button>
      </router-link>

      <!-- NOVA OPÇÃO DE CADASTRO -->
      <router-link
        to="/cadastro"
        class="text-sm text-[#2FA36A] hover:text-[#3BB77C] text-center mt-3 transition"
      >
        Não possuo cadastro
      </router-link>
    </form>

    <p v-if="erro" class="text-[#EF4444] text-sm mt-4 text-center">
      {{ erro }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { User } from 'lucide-vue-next'
import { ref } from 'vue'
import usuarioService from '../services/usuarioService'
import { useRouter } from 'vue-router'
import { useUsuario } from '../composables/useUsuario'

const email = ref('')
const senha = ref('')
const erro = ref('')
const router = useRouter()
const { setUsuario } = useUsuario()

const handleLogin = async () => {
  erro.value = ''
  try {
    const usuario = await usuarioService.login(email.value, senha.value)
    setUsuario(usuario)
    router.push('/filmes')
  } catch (e: any) {
    if (e.response?.status === 401) {
      erro.value = e.response.data // "Email incorreto." ou "Senha incorreta."
    } else {
      erro.value = e.message || 'Erro ao tentar login.'
    }
  }

}
</script>
