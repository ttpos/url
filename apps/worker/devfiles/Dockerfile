ARG IMAGES=node:20-alpine3.19
FROM $IMAGES AS node-build

WORKDIR /node

COPY app ./app
COPY public ./public
COPY server ./server
COPY databases ./databases
COPY package.json pnpm-lock.yaml tsconfig.json \
     nuxt.config.ts eslint.config.ts .env drizzle.config.ts ./

RUN npm install -g pnpm && pnpm install && pnpm build

FROM $IMAGES

WORKDIR /work

ENV PATH=$PATH:/build/bin:/work/bin

COPY --from=zzci/init / /

COPY --from=node-build /node/.output /app/worker

RUN apk add --no-cache curl bash

EXPOSE 3000

COPY devfiles/docker/rootfs /

CMD ["/start.sh"]