#!/bin/sh
set -e
cd /mnt/production
yarn install --frozen-lockfile
yarn pre-merge
yarn metrics
rm -f dist.tgz
tar cfz dist.tgz dist