#!/bin/bash

set -e

sleep 10
npm run migratedb:prod
export NODE_ENV=production && node run.js

exit 0
