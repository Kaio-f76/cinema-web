<template>
  <div class="welcome">
    <h1>Cinema Web 🎬</h1>
    <p>Bem-vindo ao sistema de cinema!</p>

    <!-- Se não estiver logado -->
    <div v-if="!usuario" class="actions">
      <router-link to="/cadastro">
        <button class="btn">Criar Conta</button>
      </router-link>
      <router-link to="/login">
        <button class="btn">Login</button>
      </router-link>
    </div>

    <!-- Se já estiver logado -->
    <div v-else class="actions">
      <router-link to="/filmes">
        <button class="btn">Ir para Filmes</button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsuario } from '../composables/useUsuario'

// Pega o estado global de usuário
const { usuario } = useUsuario()

// ⚠️ Não chamamos fetchUsuario aqui
// O estado será atualizado quando login/cadastro acontecer
</script>

<style scoped>
.welcome {
  text-align: center;
  margin-top: 80px;
  color: #333;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  background-color: #ff5722;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.btn:hover {
  background-color: #e64a19;
}
</style>
