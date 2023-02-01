#!/bin/sh
cd /mnt/production
export NODE_OPTIONS="--max-old-space-size=4096"
ls -l
yarn install
ls -l
yarn buildWS
yarn updateVersion --env.APPLICATION_VERSION $APPLICATION_VERSION