<template>
  <div class="max-w-md mx-auto mt-20 bg-[#131516] border border-[#252829] rounded-xl p-8 shadow-lg">
    
    <div class="text-center mb-8">
      <User class="w-12 h-12 text-[#2FA36A] mx-auto mb-4" />
      <h2 class="text-2xl font-bold" style="font-family: 'Poppins', sans-serif;">
        Criar Conta
      </h2>
    </div>

    <form @submit.prevent="handleCadastro" class="flex flex-col gap-4">
      <input v-model="nome" type="text" placeholder="Nome" required
        class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />

      <input v-model="email" type="email" placeholder="Email" required
        class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />

      <input v-model="senha" type="password" placeholder="Senha" required
        class="bg-[#0D0F10] border border-[#252829] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2FA36A]" />

      <button type="submit"
        class="bg-[#2FA36A] py-3 rounded-lg font-semibold hover:bg-[#3BB77C] transition">
        Confirmar Cadastro
      </button>

      <router-link to="/">
        <button type="button"
          class="w-full bg-[#1A1C1E] border border-[#252829] py-3 rounded-lg hover:bg-[#252829] transition">
          Cancelar
        </button>
      </router-link>
    </form>

    <p v-if="erro" class="text-[#EF4444] text-sm mt-4 text-center">
      {{ erro }}
    </p>

    <p v-if="sucesso" class="text-[#10B981] text-sm mt-4 text-center flex items-center justify-center gap-2">
      <Check class="w-4 h-4" />
      Cadastro realizado com sucesso!
    </p>
  </div>
</template>

<script setup lang="ts">
import { User, Check } from 'lucide-vue-next'
import { ref } from 'vue'
import usuarioService from '../services/usuarioService'
import { useRouter } from 'vue-router'
import { useUsuario } from '../composables/useUsuario'

const nome = ref('')
const email = ref('')
const senha = ref('')
const erro = ref('')
const sucesso = ref(false)
const router = useRouter()
const { setUsuario } = useUsuario()

const handleCadastro = async () => {
  erro.value = ''
  sucesso.value = false
  try {
    const usuario = await usuarioService.criarConta({
      nome: nome.value,
      email: email.value,
      senha: senha.value,
    })
    sucesso.value = true
    setUsuario(usuario)
    router.push('/filmes')
  } catch (e: any) {
    erro.value = e.message || 'Erro ao cadastrar'
  }
}
</script>
