#!/bin/sh
APP_DATABASE_NAME='WORKSTATION_HOMESCREEN_ADMIN'

mvn clean
mvn -Denv.APP_DATABASE_NAME=$APP_DATABASE_NAME dependency:copy-dependencies

APP_STRING_BUNDLE_FILE=$(find ./lib -name $APP_DATABASE_NAME*.zip)
MENU_STRING_BUNDLE_FILE=$(find ./lib -name WORKSTATION_PLUGIN_INTEGRATION*.zip)

rm -rf locale
mdkir locale

unzip -o -j $MENU_STRING_BUNDLE_FILE -d public/assets/i18n
unzip -o -j $APP_STRING_BUNDLE_FILE -d locale
