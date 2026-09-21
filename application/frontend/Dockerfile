FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

EXPOSE 5173

# Roda o Vite exposto na rede (--host permite acesso externo)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
