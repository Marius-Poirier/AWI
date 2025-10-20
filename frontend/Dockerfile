# --- Étape 1 : Build Angular ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --omit=dev && \
    echo "Build terminé, vérification du contenu:" && \
    ls -la dist/ && \
    ls -la dist/frontend/ || echo "Pas de dossier frontend" && \
    ls -la dist/frontend/browser/ || echo "Pas de dossier browser"

# --- Étape 2 : Serveur Nginx ---
FROM nginx:1.29.2-alpine
WORKDIR /usr/share/nginx/html
# Copie du build Angular (nouveau format avec /browser)
COPY --from=build /app/dist/frontend/browser/ /usr/share/nginx/html/
# Copie du fichier de configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]