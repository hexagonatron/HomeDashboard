FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /home-dashboard

COPY [".", "/home-dashboard"]

RUN npm install

RUN npm run build

CMD ["npm", "start"]