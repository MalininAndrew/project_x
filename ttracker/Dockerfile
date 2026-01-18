FROM node:22-alpine AS builder

WORKDIR /backend

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22-alpine

WORKDIR /backend

COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/dist ./dist
COPY --from=builder /backend/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
