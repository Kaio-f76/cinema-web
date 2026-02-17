<template>
  <div class="cadastro">
    <h2>Criar Conta</h2>
    <form @submit.prevent="handleCadastro">
      <input v-model="nome" type="text" placeholder="Nome" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="senha" type="password" placeholder="Senha" required />

      <button type="submit">Confirmar Cadastro</button>
      <router-link to="/">
        <button type="button">Cancelar</button>
      </router-link>
    </form>

    <p v-if="erro" class="erro">{{ erro }}</p>
    <p v-if="sucesso" class="sucesso">Cadastro realizado com sucesso!</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import usuarioService from '../services/usuarioService'

const nome = ref('')
const email = ref('')
const senha = ref('')
const erro = ref('')
const sucesso = ref(false)

const handleCadastro = async () => {
  erro.value = ''
  sucesso.value = false
  try {
    await usuarioService.criarConta({
      nome: nome.value,
      email: email.value,
      senha: senha.value,
    })
    sucesso.value = true
  } catch (e: any) {
    erro.value = e.message || 'Erro ao cadastrar'
  }
}
</script>

<style scoped>
.erro { color: red; }
.sucesso { color: green; }
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
