#!/usr/bin/env bash

export APPLICATION_SHORT_VERSION_PREFIX="11.3."
export APPLICATION_LONG_VERSION_PREFIX="${APPLICATION_SHORT_VERSION_PREFIX}0800."

export GROUP_ID_BASE='com.microstrategy'
export ARTIFACT_ID_BASE='workstation-homescreen-admin'

export VAGRANT_BOXES_CENTOS_NAME='centos-7-2-x86_64'
export VAGRANT_BOXES_CENTOS_VERSION='1.0.2.next'

export VAGRANT_BOXES_WINDOWS_NAME='windows-2008-r2'
export VAGRANT_BOXES_WINDOWS_VERSION='1.0.4.next'

export VAGRANT_BOXES_OSX_NAME='osx-10.11.3'
export VAGRANT_BOXES_OSX_VERSION='1.0.0.next'

export FFMPEG=/usr/local/bin/ffmpeg
export PATH=$FFMPEG:$PATH

export AWS_IAM_AUTHENTICATOR=/usr/local/aws
export PATH=$AWS_IAM_AUTHENTICATOR:$PATH


export KUBECTL=/usr/local/kubectl
export PATH=/usr/local:$PATH

if uname -a | grep -q "MSYS"; then
  export WS_TEST_PLATFORM=win
  SEVEN_ZIP_PATH="/c/Program Files/7-Zip/"
  export PATH=$SEVEN_ZIP_PATH:$PATH
else
  export WS_TEST_PLATFORM=mac
fi

nodejs_version="16.17.0"
export nodejs_image_tag=$nodejs_version
if uname -a | grep -q "Darwin"; then
  export NODE_HOME=/usr/local/nodejs-binary-$nodejs_version
  export PATH=$NODE_HOME/bin:$PATH
elif uname -a | grep -q "MSYS"; then
  export NODE_HOME=/c/node/node-v$nodejs_version-win-x64/
  export PATH=$NODE_HOME:$PATH
else
  export NODE_HOME=/usr/local/nodejs-binary-$nodejs_version
  export PATH=$NODE_HOME/bin:$PATH
  export PATH=~/.npm-global/bin:$PATH
fi

export BASE_BRANCH="m2021"
export BRANCH_OFF_COMMIT=c353eed8e86af1ea23673b2436e9d34ba9b1bafa
