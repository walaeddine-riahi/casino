FROM docker.io/node:20-alpine

ENV HOST=0.0.0.0
ENV PORT=8001
EXPOSE ${PORT}

WORKDIR /app

RUN addgroup --system notification-service && \
  adduser --system -G notification-service notification-service

COPY --chown=notification-service:notification-service package*.json .
COPY --chown=notification-service:notification-service dist/apps/notification-service .

RUN npm install --production

CMD [ "node", "./main.js" ]
