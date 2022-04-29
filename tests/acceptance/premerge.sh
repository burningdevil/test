#!/bin/sh
set -e
cd /mnt/tests/acceptance
yarn install --frozen-lockfile
yarn pre-merge