# Étape 1 – Build Angular app
FROM node:22.18.0-alpine AS build
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet et builder l'app
COPY . .
RUN npm run build --prod

# Étape 2 : Serve statique avec nginx
FROM nginx:1.29.0-alpine

# Copier le build Angular
COPY --from=build /app/dist/pmdb /usr/share/nginx/html

# Remplacer la conf par défaut de nginx (optionnel)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
