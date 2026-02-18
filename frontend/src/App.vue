<template>
  <div id="app">
    <header>
      <h1>Cinema Web 🎬</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link v-if="!usuario" to="/login">Login</router-link>
        <router-link v-if="!usuario" to="/cadastro">Cadastro</router-link>
        <button v-if="usuario" @click="handleLogout">Logout</button>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUsuario } from './composables/useUsuario'
import usuarioService from './services/usuarioService'
import { useRouter } from 'vue-router'

const { usuario, clearUsuario, fetchUsuario } = useUsuario()
const router = useRouter()

const handleLogout = async () => {
  await usuarioService.logout()
  clearUsuario()
  router.push('/login')
}
</script>

<style scoped>
header {
  background: #222;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav {
  display: flex;
  gap: 15px;
}
nav a, button {
  color: #fff;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}
nav a.router-link-active {
  font-weight: bold;
}
main {
  padding: 20px;
}
</style>
