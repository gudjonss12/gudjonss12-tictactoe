#!/bin/bash

# Remove old files that are no longer relevant to the current build.
echo Cleaning up irrelevant files
rm -rf ./dist
rm -rf ./.env

# Get the GIT commit hash and the GIT url into variables
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  # Create a .env file for docker-compose.yaml to read.
  echo GIT_COMMIT=$GIT_COMMIT > ./.env
  export GIT_URL=$(git config --get remote.origin.url)
fi

# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)

# Build the project
echo Building application
npm run build

# Ensure that npm run build exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm build failed with exit code " $rc
    exit $rc
fi

# Write down the GIT commit hash
mkdir ./dist/
cat > ./dist/githash.txt <<_EOF_
$GIT_COMMIT
_EOF_

# Store the applications version information in version.html
cd ./dist/
mkdir ./public/
touch version.html
cd ..
cat > ./dist/public/version.html << _EOF_
<!doctype html>
<head>
   <title>App version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GITHUB_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GITHUB_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_

# Copy the necessary files to the build directory before building the docker image
cp ./Dockerfile ./build/
cp ./package.json ./build/
cp ./wait.sh ./build/
cp ./.env ./build/

# Copy the necessary files to the AWS machine.
# TODO move this to a separate script
echo Copying necessary files to AWS instance
scp -i ./admin-key-key-ireland.pem ./{docker-compose.yaml,.env} ec2-user@52.51.82.250:~/
echo Done copying to AWS instance


cd build
echo Building docker image: gudjonss12/tictactoe:$GIT_COMMIT
docker build -t gudjonss12/tictactoe:$GIT_COMMIT .

# Ensure that docker build exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker failed building image gudjonss12/tictactoe:$GIT_COMMIT " $rc
    exit $rc
fi

echo Pushing docker image: gudjonss12/tictactoe:$GIT_COMMIT
docker push gudjonss12/tictactoe:$GIT_COMMIT

# Ensure that docker push exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker failed pushing image gudjonss12/tictactoe:$GIT_COMMIT " $rc
    exit $rc
fi

echo "Done, everything went according to plan! Celebrate, have a beer or something."
