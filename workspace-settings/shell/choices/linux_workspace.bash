#!/usr/bin/env bash

register_workspace_setting 'linux_workspace'

function set_workspace_settings_to_linux_workspace() {
  export VAGRANT_DEFAULT_PROVIDER=virtualbox
  export VAGRANT_CONTEXT="${VAGRANT_DEFAULT_PROVIDER}/linux_workspace"
 
  export TEST_TYPES=linux_workspace
  export HATS=linux_workspace
}