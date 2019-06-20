#!/bin/sh
cd /mnt/production
npm install
npm run unit-test
npm run build
