#!/bin/bash

set -e

# Wait for 10 seconds bere running migratedb:prod to ensure that the database
# has had enough time to properly boot up
sleep 10
npm run migratedb:prod

# Set the NODE_ENV variable to production and fire up the server
export NODE_ENV=production && node run.js

exit 0
