<template>
  <div id="app">
    <header>
      <h1>Cinema Web 🎬</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/cadastro">Cadastro</router-link>
        <router-link to="/login">Login</router-link>
      </nav>
    </header>

    <main>
      <!-- Aqui o Vue Router renderiza a tela correspondente -->
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica necessária aqui
</script>

<style scoped>
header {
  background: #222;
  color: #fff;
  padding: 10px;
}
nav {
  margin-top: 10px;
}
nav a {
  margin-right: 15px;
  color: #fff;
  text-decoration: none;
}
nav a.router-link-active {
  font-weight: bold;
}
main {
  padding: 20px;
}
</style>
