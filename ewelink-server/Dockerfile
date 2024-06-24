# Use a imagem base do Node.js
FROM node:lts-alpine

# Defina o diretório de trabalho
WORKDIR /usr/src/app

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
