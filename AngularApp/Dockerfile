# Build Angular
FROM node:22 AS build
WORKDIR /app
COPY  package*.json ./
RUN npm install
COPY / ./
RUN npm run build -- --configuration production

# Serve Angular app
FROM nginx:alpine
COPY  nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/AngularApp/browser /usr/share/nginx/html
EXPOSE 80

