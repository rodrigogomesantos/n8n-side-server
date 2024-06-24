# Dockerfile
# Use a imagem base do Node.js
FROM node:lts-alpine

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Instalar Python e dependências necessárias para node-gyp
RUN apk update && \
    apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# Copie os arquivos package.json e package-lock.json
COPY package.json package-lock.json ./

# Instale as dependências usando npm
RUN npm install

# Copie o código-fonte da aplicação
COPY . .

# Exponha a porta que o servidor irá rodar
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "index.js"]
