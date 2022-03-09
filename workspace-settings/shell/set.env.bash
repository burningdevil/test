#!/usr/bin/env bash

export APPLICATION_SHORT_VERSION_PREFIX="11.3."
export APPLICATION_LONG_VERSION_PREFIX="${APPLICATION_SHORT_VERSION_PREFIX}0560."

export GROUP_ID_BASE='com.microstrategy'
export ARTIFACT_ID_BASE='workstation-homescreen-admin'

export VAGRANT_BOXES_CENTOS_NAME='centos-7-2-x86_64'
export VAGRANT_BOXES_CENTOS_VERSION='1.0.2.next'

export VAGRANT_BOXES_WINDOWS_NAME='windows-2008-r2'
export VAGRANT_BOXES_WINDOWS_VERSION='1.0.4.next'

export VAGRANT_BOXES_OSX_NAME='osx-10.11.3'
export VAGRANT_BOXES_OSX_VERSION='1.0.0.next'

export HELM=/usr/local/helm
export PATH=$HELM:$PATH

export AWS_IAM_AUTHENTICATOR=/usr/local/aws
export PATH=$AWS_IAM_AUTHENTICATOR:$PATH


export KUBECTL=/usr/local/kubectl
export PATH=/usr/local:$PATH

if uname -a | grep -q "MSYS"; then
  export WS_TEST_PLATFORM=win
  SEVEN_ZIP_PATH="/c/Program Files/7-Zip/"
  NODE_HOME=/c/node/node-v12.13.0-win-x64/
  export PATH=$NODE_HOME:$SEVEN_ZIP_PATH:$PATH
else
  export WS_TEST_PLATFORM=mac
  export PATH=~/.npm-global/bin:$PATH
fi

export BASE_BRANCH="m2021"
export BRANCH_OFF_COMMIT=7c19d8fca7e38ba815c8f70c09f14fddeec3e41d