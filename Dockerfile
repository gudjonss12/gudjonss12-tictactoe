FROM node
MAINTAINER gudjonss12

WORKDIR /code
COPY . .
ENV NODE_PATH .
RUN npm install --silent
EXPOSE 3000
CMD ./wait.sh
