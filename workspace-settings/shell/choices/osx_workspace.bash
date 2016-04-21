#!/usr/bin/env bash



function set_workspace_settings_to_osx_workspace() {
  export VAGRANT_DEFAULT_PROVIDER=virtualbox
  export VAGRANT_CONTEXT="${VAGRANT_DEFAULT_PROVIDER}/osx_workspace"
 
  export TEST_TYPES=osx_workspace
  export HATS=osx_workspace
}