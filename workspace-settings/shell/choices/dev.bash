#!/usr/bin/env bash

register_workspace_setting 'dev'

function set_workspace_settings_to_dev() {
  export KUBECONFIG=$HOME/config-kube-tanzu
  export TEST_TYPES=dev:acceptance:acceptance_mac:acceptance_windows
  export HATS=dev:pipeline
}
