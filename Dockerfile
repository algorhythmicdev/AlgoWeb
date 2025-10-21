FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS build
ARG PUBLIC_STRAPI_URL=https://cms.algorhythmics.dev
ARG PUBLIC_SITE_URL=https://algorhythmics.dev
ENV PUBLIC_STRAPI_URL=$PUBLIC_STRAPI_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ARG PUBLIC_STRAPI_URL=https://cms.algorhythmics.dev
ARG PUBLIC_SITE_URL=https://algorhythmics.dev
ENV PUBLIC_STRAPI_URL=$PUBLIC_STRAPI_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/build ./build
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "build"]
