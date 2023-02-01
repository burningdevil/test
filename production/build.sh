#!/bin/sh
echo $(whoami)
cd /mnt/production
export NODE_OPTIONS="--max-old-space-size=4096"
# ls -l
# yarn install
ls -l
npm install -g npm@9.4.0
yarn buildWS
yarn updateVersion --env.APPLICATION_VERSION $APPLICATION_VERSION