<template>
  <div class="filmes">
    <h2>Lista de Filmes</h2>
    <p>Bem-vindo, você está autenticado na sessão!</p>

    <ul>
      <li>Filme 1 - Ação</li>
      <li>Filme 2 - Comédia</li>
      <li>Filme 3 - Drama</li>
    </ul>

    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import usuarioService from '../services/usuarioService'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = async () => {
  try {
    await usuarioService.logout()
    alert("Sessão encerrada com sucesso.")
    router.push('/login')
  } catch (e: any) {
    alert("Erro ao encerrar sessão.")
  }
}
</script>

<style scoped>
.filmes {
  text-align: center;
  margin-top: 30px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
