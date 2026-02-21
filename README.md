# Frontend -- sistema de gestão de cinema
---
## Introdução
Este repositório contém o **frontend** do sistema de cinema, desenvolvido em **Vue.js + TypeScript**.  
O projeto consome os endpoints expostos pelo backend (Spring Boot) e permite que o usuário realize ações como **cadastro** e **login**.

---
## Documentação complementar
Para detalhes adicionais sobre o funcionamento do projeto e sua integração com o backend, consulte os documentos na pasta `docs/`:

- [Docker fullstack](docs/docker-fullstack.md) → Explica a dinâmica de rodar frontend e backend juntos via Docker Compose.  

- [Mysql](docs/mysql.md) → Guia de acesso ao banco de dados MySQL dentro do Docker, comandos SQL úteis e como limpar dados.  

- [Vuejs tutorial](docs/vuejs-tutorial.md) → Tutorial completo sobre Vue.js + TypeScript, explicando conceitos, estrutura e uso com Docker. 
---

## Tecnologias utilizadas
- **Vue.js 3** com Composition API  
- **TypeScript**  
- **Axios** para chamadas HTTP  
- **Vite** como bundler  
- **Docker** para containerização  

---

## Como rodar o projeto

### Rodando localmente
1. Instale as dependências:
   ```bash
   npm install
   npm install -D @tailwindcss/vite
   npm install lucide-vue-next
   ```
2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse no navegador:
   ```
   http://localhost:5173
   ```

---

### Rodando com Docker
1. Gere a imagem Docker:
   ```bash
   docker build -t cinema-frontend:latest .
   ```
2. Rode o container:
   ```bash
   docker run -p 5173:5173 cinema-frontend:latest
   ```
3. Acesse no navegador:
   ```
   http://localhost:5173
   ```
 

