#!/bin/bash

echo Cleaning...
rm -rf ./dist

# Get the GIT commit hash and the GIT url into variables
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GIT_URL=$(git config --get remote.origin.url)
fi

# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)

# Build the project
echo Building app
npm run build

# Ensure that npm run build exited with rc = 0
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
cd build
echo Building docker image

# TODO add :$GIT_COMMIT to gudjonss12/tictactoe
docker build -t gudjonss12/tictactoe .

# Ensure that docker build exited with rc = 0
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi

docker push gudjonss12/tictactoe:$GIT_COMMIT

# Ensure that docker push exited with rc = 0
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

echo "Done, all processes successful"
