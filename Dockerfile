FROM oven/bun:1 AS builder
WORKDIR /app
COPY package*.json ./
RUN bun i
COPY . .
# ARG VITE_BACKEND_URL
# ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN bun --bun run build
# RUN bun run prune --production

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "bun","./build/index.js" ]