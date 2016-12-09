#!/bin/bash


# Failsafe for git commit variable
# A test
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  # Create a .env file for docker-compose.yaml to read.
  export GIT_URL=$(git config --get remote.origin.url)
fi

echo Building docker image: gudjonss12/tictactoe:$GIT_COMMIT
docker build -t gudjonss12/tictactoe:$GIT_COMMIT .

# Ensure that docker build exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker failed building image gudjonss12/tictactoe:$GIT_COMMIT " $rc
    exit $rc
fi

# Pushing docker image with the latest git commit hash !
echo Pushing docker image: gudjonss12/tictactoe:$GIT_COMMIT
docker push gudjonss12/tictactoe:$GIT_COMMIT

# Ensure that docker push exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker failed pushing image gudjonss12/tictactoe:$GIT_COMMIT " $rc
    exit $rc
fi
