#!/bin/sh
cd /mnt/production
npm ci
npm run unit-test
npm run buildWS
npm run updateVersion -- --env.APPLICATION_VERSION $APPLICATION_VERSION
