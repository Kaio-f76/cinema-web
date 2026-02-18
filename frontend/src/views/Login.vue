<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="senha" type="password" placeholder="Senha" required />

      <button class="btn" type="submit">Entrar</button>
      <router-link to="/">
        <button class="btn-secondary" type="button">Cancelar</button>
      </router-link>
    </form>

    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
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
    setUsuario(usuario) // salva no estado global
    router.push('/filmes')
  } catch (e: any) {
    erro.value = e.message || 'Dados inválidos'
  }
}
</script>


<style scoped>
.login {
  text-align: center;
  margin-top: 50px;
}
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
}
input {
  margin: 10px 0;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.btn {
  background-color: #ff5722;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background-color: #e64a19;
}
.btn-secondary {
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #aaa;
}
.erro {
  color: red;
  margin-top: 10px;
}
</style>
