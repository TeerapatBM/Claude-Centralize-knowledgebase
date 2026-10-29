FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:onprem
FROM node:24-bookworm-slim
ENV NODE_ENV=production DATA_DIR=/data STATIC_DIR=/app/onprem-dist BIND_HOST=0.0.0.0
WORKDIR /app
COPY --from=build /app/onprem-dist ./onprem-dist
COPY --from=build /app/onprem ./onprem
COPY --from=build /app/lib ./lib
COPY package.json ./
RUN find /app -type d -exec chmod 0755 {} + \
    && find /app -type f -exec chmod 0644 {} + \
    && mkdir -p /data && chown node:node /data
USER node
RUN node --input-type=module -e "await import('./onprem/server.ts')"
EXPOSE 3000
CMD ["node", "onprem/server.ts"]
