FROM node
MAINTAINER gudjonss12

WORKDIR /code
COPY . .
ENV NODE_PATH .
RUN echo $NODE_PATH
RUN npm install --silent

CMD ["node","run.js"]
