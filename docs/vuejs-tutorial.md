# Vuejs - tutorial

---

## Introdução ao Vue.js + TypeScript
O Vue.js é um framework progressivo para construção de interfaces.  
Combinado ao TypeScript, oferece tipagem estática e maior robustez no desenvolvimento.


---

### Estrutura básica
Um componente Vue é definido em arquivos `.vue` com três seções:
```vue
<template>
  <div>{{ mensagem }}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const mensagem = ref("Olá Vue + TS!");
</script>

<style scoped>
div { color: blue; }
</style>
```
---

### Principais conceitos
- **Reatividade**: usando `ref` e `reactive`.
- **Props**: passagem de dados entre componentes.
- **Emit**: comunicação de eventos filho → pai.
- **Routing**: navegação entre páginas com `vue-router`.
- **State Management**: gerenciamento de estado global com `pinia`.

---

### Configuração com Vite
O Vite é usado como bundler:
```bash
npm create vite@latest
```
Selecione `Vue + TypeScript`.

---

### Chamadas HTTP com Axios
```ts
import axios from "axios";

axios.post("http://localhost:8080/api/usuarios/login", {
  email: "teste@email.com",
  senha: "123456"
}).then(res => {
  console.log(res.data);
});
```
---

### Dockerização do Vue.js
1. Crie o `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 5173
   CMD ["npm", "run", "dev"]
   ```
2. Gere a imagem:
   ```bash
   docker build -t cinema-frontend:latest .
   ```
3. Rode o container:
   ```bash
   docker run -p 5173:5173 cinema-frontend:latest
   ```
