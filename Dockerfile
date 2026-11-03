FROM node

RUN mkdir -p docker_practice

COPY . /docker_practice

CMD ["node", "/docker_practice/server.js"]