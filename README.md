
# eWeLink Server and n8n Integration

Este projeto configura um servidor intermediário para integrar a API eWeLink com o n8n usando Docker. Abaixo estão as instruções para configuração, construção e execução dos containers Docker.

## Estrutura do Projeto

```
seu-projeto/
├── docker-compose.yml
├── ewelink-server/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
```

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Configuração do Docker

### `docker-compose.yml`

```yaml
version: '3.1'

services:
  ewelink-server:
    build:
      context: ./ewelink-server
    ports:
      - "3000:3000"
    restart: always
    volumes:
      - ewelink_data:/usr/src/app/data

  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
      - WEBHOOK_TUNNEL_URL=http://localhost:5678
    restart: always
    volumes:
      - ./n8n_data:/root/.n8n
    depends_on:
      - ewelink-server

volumes:
  ewelink_data:
    driver: local
```

### `ewelink-server/Dockerfile`

```dockerfile
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
```

### `ewelink-server/package.json`

Certifique-se de que o `package.json` inclui as dependências necessárias:

```json
{
  "name": "ewelink-server",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.19.2",
    "ewelink-api": "^3.1.1",
    "express-basic-auth": "^1.2.1"
  }
}
```

## Comandos Docker

### Construir e Iniciar os Containers

Para construir e iniciar os containers, execute:

```bash
docker-compose up --build
```

### Atualizar o Código do Servidor

Se você atualizar o código do servidor, siga os passos abaixo para aplicar as mudanças sem perder os dados do n8n:

1. **Reconstruir a Imagem Docker do Servidor**

```bash
docker-compose build ewelink-server
```

2. **Reiniciar o Serviço do Servidor**

```bash
docker-compose up -d ewelink-server
```

### Parar os Containers

Para parar os containers, execute:

```bash
docker-compose down
```

### Verificar Logs dos Containers

Para verificar os logs do container do servidor:

```bash
docker-compose logs -f ewelink-server
```

### Acessar o Container

Para usar o terminal dentro do container:

```bash
docker-compose run --rm ewelink-server sh

```
### Limpar e Remover Containers e Imagens

Limpa tudo:

```bash
docker-compose down --rmi all --volumes --remove-orphans
```

## Testar a Autenticação e Toggle Device

### Arquivo `.http` para Teste com VS Code

Crie um arquivo `.http` com o seguinte conteúdo para testar a autenticação e a alternância do dispositivo:

```http
### Teste de Autenticação e Toggle Device
POST http://localhost:3000/toggle/{{DEVICE_ID}}
Authorization: Basic {{BASIC_AUTH_TOKEN}}
Content-Type: application/json
```

Substitua `{{DEVICE_ID}}` pelo ID do dispositivo e `{{BASIC_AUTH_TOKEN}}` pelo token de autenticação básica gerado com suas credenciais.

## Gerar Token de Autenticação Básica

Para gerar o token de autenticação básica, codifique suas credenciais no formato `email:password` em Base64:

```bash
echo -n "seu_email@example.com:sua_senha" | base64
```

Substitua `{{BASIC_AUTH_TOKEN}}` pelo valor codificado gerado.

## Para acessar do n8n

```bash
http://ewelink-server:3000/toggle/IDdoComponente
```
## Licença

Este projeto está licenciado sob a MIT License.
