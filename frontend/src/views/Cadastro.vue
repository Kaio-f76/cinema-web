<template>
  <div class="cadastro">
    <h2>Criar Conta</h2>
    <form @submit.prevent="handleCadastro">
      <input v-model="nome" type="text" placeholder="Nome" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="senha" type="password" placeholder="Senha" required />

      <button class="btn" type="submit">Confirmar Cadastro</button>
      <router-link to="/">
        <button class="btn-secondary" type="button">Cancelar</button>
      </router-link>
    </form>

    <p v-if="erro" class="erro">{{ erro }}</p>
    <p v-if="sucesso" class="sucesso">Cadastro realizado com sucesso!</p>
  </div>
</template>

<script setup lang="ts">
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
    setUsuario(usuario) // salva no estado global
    router.push('/filmes')
  } catch (e: any) {
    erro.value = e.message || 'Erro ao cadastrar'
  }
}
</script>


<style scoped>
.cadastro {
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
.sucesso {
  color: green;
  margin-top: 10px;
}
</style>
