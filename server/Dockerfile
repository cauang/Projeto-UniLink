FROM node:18-alpine

WORKDIR /app

# Copiar apenas o package.json primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Expor a porta que o app usa
EXPOSE 8080

# Comando para iniciar o app
CMD ["npm", "start"]