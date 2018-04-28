FROM node:8.4.0

# Install yarn
RUN npm i -g yarn

RUN mkdir -p /app

WORKDIR /app

ADD . .
RUN yarn install --quiet

RUN npm install typescript --global

EXPOSE 3000

EXPOSE 4040

CMD [ "yarn", "start" ]