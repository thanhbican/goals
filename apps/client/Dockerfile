FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
ARG VITE_BASE_URL=https://game.s4md.com/api
ARG VITE_SOCKET_URL=https://game.s4md.com
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY packages ./packages
COPY apps/client ./apps/client
RUN pnpm install --frozen-lockfile --filter client...
RUN pnpm --filter client build

FROM nginx:1.27-alpine AS runner
COPY apps/client/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
