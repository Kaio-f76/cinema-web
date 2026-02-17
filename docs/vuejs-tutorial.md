# Vuejs - tutorial

---

## Introdução ao Vue.js + TypeScript
O Vue.js é um framework progressivo para construção de interfaces.  
Combinado ao TypeScript, oferece tipagem estática e maior robustez no desenvolvimento.  
No projeto cinema, o frontend foi estruturado para consumir os endpoints do backend e oferecer ao usuário fluxos como **cadastro** e **login**.

---

## Estrutura do projeto

A arquitetura do frontend está organizada em `src/` com as seguintes pastas:

```
src/
  assets/       -> arquivos estáticos (imagens, ícones, estilos globais)
  components/   -> componentes reutilizáveis (botões, formulários, cabeçalhos)
  router/       -> configuração das rotas (vue-router)
  services/     -> integração com backend via Axios
  store/        -> gerenciamento de estado global (Pinia)
  types/        -> definição de tipos e interfaces TypeScript
  views/        -> telas principais (Cadastro, Login, Dashboard, etc.)
  main.ts       -> ponto de entrada da aplicação
```

---

## Desenvolvimento de novas funcionalidades

### 1. Adicionar uma nova tela (View)
1. Crie um arquivo `.vue` em `src/views/`.  
   Exemplo: `CadastroView.vue`
   ```vue
   <template>
     <div>
       <h1>Cadastro</h1>
       <CadastroForm />
     </div>
   </template>

   <script lang="ts" setup>
   import CadastroForm from '../components/CadastroForm.vue';
   </script>
   ```

2. Registre a rota em `src/router/index.ts`:
   ```ts
   import { createRouter, createWebHistory } from 'vue-router';
   import CadastroView from '../views/CadastroView.vue';

   const routes = [
     { path: '/cadastro', component: CadastroView },
   ];

   export default createRouter({
     history: createWebHistory(),
     routes,
   });
   ```

---

### 2. Criar um novo componente
1. Crie em `src/components/`:
   ```vue
   <template>
     <form @submit.prevent="submit">
       <input v-model="email" placeholder="Email" />
       <input v-model="senha" type="password" placeholder="Senha" />
       <button type="submit">Entrar</button>
     </form>
   </template>

   <script lang="ts" setup>
   import { ref } from 'vue';

   const email = ref('');
   const senha = ref('');

   const submit = () => {
     console.log(email.value, senha.value);
   };
   </script>
   ```

---

### 3. Criar um novo service
1. Em `src/services/usuarioService.ts`:
   ```ts
   import axios from 'axios';

   const API_URL = import.meta.env.VITE_BACKEND_URL;

   export const login = async (email: string, senha: string) => {
     return axios.post(`${API_URL}/usuarios/login`, { email, senha });
   };

   export const cadastro = async (nome: string, email: string, senha: string) => {
     return axios.post(`${API_URL}/usuarios/cadastro`, { nome, email, senha });
   };
   ```

---

### 4. Adicionar tipos (TypeScript)
Em `src/types/Usuario.ts`:
```ts
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: string;
  saldo: number;
}
```

---

### 5. Gerenciar estado global
Em `src/store/usuarioStore.ts`:
```ts
import { defineStore } from 'pinia';
import { Usuario } from '../types/Usuario';

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    usuario: null as Usuario | null,
  }),
  actions: {
    setUsuario(u: Usuario) {
      this.usuario = u;
    },
    logout() {
      this.usuario = null;
    }
  }
});
```

---

## Fluxo de desenvolvimento no projeto cinema
- **Cadastro**: usuário acessa `/cadastro`, preenche formulário → chama `usuarioService.cadastro` → backend cria conta → frontend redireciona para login.  
- **Login**: usuário acessa `/login`, informa credenciais → chama `usuarioService.login` → backend valida → frontend salva usuário no `store` e redireciona para `/dashboard`.  
- **Dashboard**: tela inicial após login, listará filmes (UC_003) e permitirá compra de ingressos (UC_004).  

---

## Dockerização do Vue.js
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

---

## Conclusão
O frontend do projeto cinema está estruturado para permitir evolução rápida e organizada.  
A arquitetura em `src/` garante separação de responsabilidades: **views** para telas, **components** para elementos reutilizáveis, **services** para comunicação com backend, **store** para estado global, e **types** para tipagem.  
Com essa base, adicionar novas funcionalidades (telas, rotas, serviços) segue um fluxo claro e padronizado, facilitando a manutenção e expansão do sistema.  

