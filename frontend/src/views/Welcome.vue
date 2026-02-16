<template>
  <div class="welcome">
    <h1>Cinema Web 🎬</h1>
    <p>Bem-vindo ao sistema de cinema!</p>
    <div class="actions">
      <router-link to="/cadastro">
        <button>Criar Conta</button>
      </router-link>
      <router-link to="/login">
        <button>Login</button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica necessária aqui
</script>

<style scoped>
.welcome {
  text-align: center;
  margin-top: 50px;
}
.actions {
  margin-top: 20px;
}
button {
  margin: 0 10px;
  padding: 10px 20px;
}
</style>
