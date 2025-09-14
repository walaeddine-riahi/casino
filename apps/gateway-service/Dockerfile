FROM docker.io/node:20-alpine

ENV HOST=0.0.0.0
ENV PORT=8000
EXPOSE ${PORT}

WORKDIR /app

RUN addgroup --system gateway-service && \
  adduser --system -G gateway-service gateway-service

COPY --chown=gateway-service:gateway-service package*.json .
COPY --chown=gateway-service:gateway-service dist/apps/gateway-service .

RUN npm install --production

CMD [ "node", "./main.js" ]
