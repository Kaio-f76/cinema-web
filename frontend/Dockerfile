# Imagem base oficial do Node
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de configuração primeiro (para cache eficiente)
COPY package*.json ./

# Instalar dependências
RUN npm install 
RUN npm install vue-router

# Copiar o restante do código fonte
COPY . .

# Expor porta padrão do Vite
EXPOSE 5173

# Comando para rodar servidor de desenvolvimento
CMD ["npm", "run", "dev"]
