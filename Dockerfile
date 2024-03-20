# Stage 1: Compile and Build angular codebase
FROM node:lts as build

WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build
#CMD npm run start

# Stage 2: Serve app with nginx
FROM nginx:alpine
COPY --from=build /app/deployment/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/edc-demo-client /usr/share/nginx/html
COPY --from=build /app/src/assets /usr/share/nginx/html/assets
EXPOSE 80

# # Modify the configuration file 
# CMD echo "{\n  \"_comment\": \"This file will be replaced at runtime when deployed to the cloud\",\n  \"dataManagementApiUrl\": \"http://localhost:8182/api/v1/data\",\n  \"catalogUrl\": \"http://localhost:8181/api/federatedcatalog\",\n  \"storageAccount\": \"account\",\n  \"storageExplorerLinkTemplate\": \"storageexplorer://v=1\",\n  \"apiKey\": \"password\",\n  \"theme\": \"theme-1\"\n}" > /usr/share/nginx/html/assets/config/app.config.json
ENV COMMENT="This file will be replaced at runtime when deployed to the cloud"
ENV DATA_MANAGEMENT_URL="http://localhost:9192/management"
ENV CATALOG_URL="http://localhost:9191/api"
ENV STORAGE_ACCOUNT="account"
ENV STORAGE_EXPLORER_LINK_TEMPLATE="storageexplorer://v=1"
ENV API_KEY="password"
ENV THEME="theme-1"


CMD ["/bin/sh",  "-c", "echo '{\n  \"_comment\": \"'$COMMENT'\",\n  \"managementApiUrl\": \"'$DATA_MANAGEMENT_URL'\",\n  \"catalogUrl\": \"'$CATALOG_URL'\",\n  \"storageAccount\": \"'$STORAGE_ACCOUNT'\",\n  \"storageExplorerLinkTemplate\": \"'$STORAGE_EXPLORER_LINK_TEMPLATE'\",\n  \"apiKey\": \"'$API_KEY'\",\n  \"theme\": \"'$THEME'\"\n}' > /usr/share/nginx/html/assets/config/app.config.json && exec nginx -g 'daemon off;'"]
# HEALTHCHECK --interval=2s --timeout=5s --retries=10 \
#     CMD curl -f http://localhost/ || exit 1

# Stage 1: Compile and Build angular codebase
#FROM node:lts as build

#WORKDIR /app
#COPY ./ /app/
#RUN npm install
#RUN npm run build

# Stage 2: Build Node.js server
#FROM node:17.0.1-alpine as server

#WORKDIR /app
#COPY ["package.json", "package-lock.json*", "./"]
#RUN npm install --production

#COPY . .

# Stage 3: Serve app with nginx
#FROM nginx:alpine
#
#COPY --from=build /app/deployment/nginx.conf /etc/nginx/nginx.conf
#COPY --from=build /app/dist/edc-demo-client /usr/share/nginx/html
#COPY --from=build /app/src/assets /usr/share/nginx/html/assets
#COPY --from=server /app /usr/share/nginx/html/server
#
#EXPOSE 80 3005
#
#ENV COMMENT="This file will be replaced at runtime when deployed to the cloud"
#ENV DATA_MANAGEMENT_URL="http://localhost:9192/management"
#ENV CATALOG_URL="http://localhost:9191/api"
#ENV STORAGE_ACCOUNT="account"
#ENV STORAGE_EXPLORER_LINK_TEMPLATE="storageexplorer://v=1"
#ENV API_KEY="password"
#ENV THEME="theme-1"
#ENV NODE_ENV=production
#ENV WEBHOOK_ADDRESS: "http://localhost:3005/webhook"
#ENV WEB_SOCKET: "ws://localhost:3005/"

#CMD ["/bin/sh",  "-c", "echo '{\n  \"_comment\": \"'$COMMENT'\",\n  \"managementApiUrl\": \"'$DATA_MANAGEMENT_URL'\",\n  \"catalogUrl\": \"'$CATALOG_URL'\",\n  \"storageAccount\": \"'$STORAGE_ACCOUNT'\",\n  \"storageExplorerLinkTemplate\": \"'$STORAGE_EXPLORER_LINK_TEMPLATE'\",\n  \"apiKey\": \"'$API_KEY'\",\n  \"theme\": \"'$THEME'\"\n}' > /usr/share/nginx/html/assets/config/app.config.json && exec nginx -g 'daemon off;'"]

# HEALTHCHECK --interval=2s --timeout=5s --retries=10 \
#     CMD curl -f http://localhost/ || exit 1
