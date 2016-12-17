#!/bin/bash
# Remove old files that are no longer relevant to the current build.
echo Cleaning up irrelevant files
rm -rf ./dist
rm -rf ./.env

# Get the GIT commit hash and the GIT url into variables
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  # Create a .env file for docker-compose.yaml to read.
  export GIT_URL=$(git config --get remote.origin.url)
fi
echo GIT_COMMIT=$GIT_COMMIT > ./.env
# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)

# Install dependencies
echo Installing dependencies
cd ./client
npm install
cd ..
npm install


# Build the project
echo Building application
CI=true npm run build

# Ensure that npm run build exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm build failed with exit code " $rc
    exit $rc
fi

cd ./client
echo Running continuous integration tests client side
CI=true npm run test
cd ..

# Ensure that npm run test client side exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test: client failed with exit code " $rc
    exit $rc
fi

cd ./server
echo Running contionus integration tests server side
CI=true npm run citest
cd ..

# Ensure that npm run test server side exited with rc = 0, else exit
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test: server failed with exit code " $rc
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

echo "Done, everything went according to plan!"
