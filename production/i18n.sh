#!/bin/sh
cd /mnt/production
mvn clean
mvn dependency:copy-dependencies

echo $APP_DATABASE_NAME
APP_STRING_BUNDLE_FILE=$(find ./lib -name $APP_DATABASE_NAME*.zip)
MENU_STRING_BUNDLE_FILE=$(find ./lib -name WORKSTATION_PLUGIN_INTEGRATION*.zip)

unzip -o -j $MENU_STRING_BUNDLE_FILE -d public/assets/i18N
rm -rf locale
mkdir locale 
unzip -o -j $APP_STRING_BUNDLE_FILE -d locale
