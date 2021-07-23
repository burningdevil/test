#!/bin/sh
cd /mnt/production
export NODE_OPTIONS="--max-old-space-size=2048"
yarn install --fronzen-lockfile
yarn buildWS
yarn updateVersion --env.APPLICATION_VERSION $APPLICATION_VERSION