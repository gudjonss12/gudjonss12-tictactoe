FROM node
MAINTAINER gudjonss12

# Setting the workdir to "/code"
WORKDIR /code

# Copy from ./build locally to ./code inside the container.
COPY . .

# Set the environment vairable NODE_PATH to the workdir, that is /code
ENV NODE_PATH .

# Run setup for the project
RUN npm install --silent

# Instruct the container to listen on port 3000
EXPOSE 3000

# We run this script instead of running migratedb right away to ensure that
# the database has had proper time to boot up
CMD ./wait.sh
