FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos do servidor
COPY server/*.js ./
COPY server/*.json ./
COPY server/routes/ ./routes/
COPY server/middleware/ ./middleware/
COPY server/services/ ./services/
COPY server/repositories/ ./repositories/
COPY server/migrations/ ./migrations/
COPY server/dev/ ./dev/
COPY server/db/ ./db/

# Instalar dependências
RUN npm install

# Expor a porta que o app usa
EXPOSE 8080

# Comando para iniciar o app
CMD ["npm", "start"]