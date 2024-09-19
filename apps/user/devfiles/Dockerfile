ARG IMAGES=node:20-alpine3.19
FROM $IMAGES AS node-build

ARG NUXT_UI_PRO_LICENSE
ARG NUXT_PUBLIC_SITE_URL
ARG NUXT_LIBSQL_URL
ARG NUXT_LIBSQL_AUTH_TOKEN

WORKDIR /node

COPY app ./app
COPY public ./public
COPY server ./server
COPY package.json renovate.json tailwind.config.ts tsconfig.json \
     nuxt.config.ts drizzle.config.ts ./

RUN npm install -g pnpm; \
    pnpm install; \
    pnpm build; \
    pnpm db:gen; \
    pnpm db:migrate

FROM $IMAGES

WORKDIR /app

RUN apk add --no-cache curl bash; npm install pm2 -g

COPY --from=node-build /node/.output /app/

EXPOSE 3000

CMD ["pm2-runtime", "server/index.mjs"]
