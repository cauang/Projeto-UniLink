FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos do servidor
COPY *.js ./
COPY *.json ./
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY services/ ./services/
COPY repositories/ ./repositories/
COPY migrations/ ./migrations/
COPY dev/ ./dev/
COPY db/ ./db/

# Instalar dependências
RUN npm install

# Expor a porta que o app usa
EXPOSE 8080

# Comando para iniciar o app
CMD ["npm", "start"]