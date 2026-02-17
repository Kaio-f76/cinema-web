# Docker-fullstack
---

## Dinâmica do Fullstack com Docker
O projeto é composto por dois serviços principais:
- **Backend**: imagem `cinema-backend:latest`
- **Frontend**: imagem `cinema-frontend:latest`

Ambos são unidos pelo arquivo `infra/docker-compose.yml` localizado dentro do repositório do backend.

---

### Passo a passo
1. Certifique-se de que os repositórios **backend** e **frontend** estão clonados e configurados.
2. Gere as imagens:
   ```bash
   docker build -t cinema-backend:latest .
   docker build -t cinema-frontend:latest .
   ```
3. Suba o ambiente completo:
   ```bash
   docker compose -f infra/docker-compose.yml up --build
   ```
4. O sistema estará disponível em:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8080/api`

