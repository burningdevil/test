#!/bin/sh
cd /mnt/production
npm install
npm run unit-test
npm run buildWS
npm run updateVersion -- --env.APPLICATION_VERSION $APPLICATION_VERSION
