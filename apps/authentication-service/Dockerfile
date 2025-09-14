FROM docker.io/node:20-alpine

ENV HOST=0.0.0.0
ENV PORT=8002
EXPOSE ${PORT}

WORKDIR /app

RUN addgroup --system authentication-service && \
  adduser --system -G authentication-service authentication-service

COPY --chown=authentication-service:authentication-service package*.json .
COPY --chown=authentication-service:authentication-service dist/apps/authentication-service .

RUN npm install --production

CMD [ "node", "./main.js" ]
