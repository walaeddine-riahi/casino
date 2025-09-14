FROM docker.io/node:20-alpine

ENV HOST=0.0.0.0
ENV PORT=8003
EXPOSE ${PORT}

WORKDIR /app

RUN addgroup --system user-service && \
  adduser --system -G user-service user-service

COPY --chown=user-service:user-service package*.json .
COPY --chown=user-service:user-service dist/apps/user-service .

RUN npm install --production

CMD [ "node", "./main.js" ]
