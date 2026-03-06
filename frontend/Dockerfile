# Estágio 1: Build da aplicação React/Vite
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Aceitar a URL da API como argumento no momento do build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Estágio 2: Servir os arquivos estáticos com Nginx
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
