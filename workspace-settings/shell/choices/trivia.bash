#!/usr/bin/env bash

register_workspace_setting 'trivia'

function set_workspace_settings_to_trivia() {
  export VAGRANT_DEFAULT_PROVIDER=virtualbox
  export VAGRANT_CONTEXT="${VAGRANT_DEFAULT_PROVIDER}/trivia"
 
  export TEST_TYPES=trivia
  export HATS=trivia
}