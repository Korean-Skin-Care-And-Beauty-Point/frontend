FROM node:24-alpine3.21 AS builder
WORKDIR /app
COPY package*.json ./
RUN bun i
COPY . .
# ARG VITE_BACKEND_URL
# ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build
# RUN bun run prune --production

FROM node:24-alpine3.21
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node","build" ]