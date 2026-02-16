<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="senha" type="password" placeholder="Senha" required />

      <button type="submit">Entrar</button>
      <router-link to="/">
        <button type="button">Cancelar</button>
      </router-link>
    </form>

    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import usuarioService from '../services/usuarioService'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const erro = ref('')
const router = useRouter()

const handleLogin = async () => {
  erro.value = ''
  try {
    await usuarioService.login(email.value, senha.value)
    router.push('/filmes') // redireciona para lista de filmes
  } catch (e: any) {
    erro.value = e.message || 'Dados inválidos'
  }
}
</script>


<style scoped>
.erro { color: red; }
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
}
input, button {
  margin: 10px 0;
  padding: 10px;
}
</style>
