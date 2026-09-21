FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências primeiro (cache de layer)
COPY package*.json ./

# Instala as dependências
RUN npm install --production

# Copia o resto do código
COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
