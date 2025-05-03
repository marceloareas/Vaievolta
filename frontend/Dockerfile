# Usar a imagem oficial do Node.js como base
FROM node:16

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos de configuração e dependências
COPY package.json package-lock.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código do frontend
COPY . .

# Expor a porta que o frontend vai rodar
EXPOSE 3000

# Comando para rodar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
