FROM docker.io/node:20-alpine

ENV HOST=0.0.0.0
ENV PORT=8004
EXPOSE ${PORT}

WORKDIR /app

RUN addgroup --system promotion-service && \
  adduser --system -G promotion-service promotion-service

COPY --chown=promotion-service:promotion-service package*.json .
COPY --chown=promotion-service:promotion-service dist/apps/promotion-service .

RUN npm install --production

CMD [ "node", "./main.js" ]
