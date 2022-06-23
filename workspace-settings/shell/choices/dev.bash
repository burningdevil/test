#!/usr/bin/env bash

register_workspace_setting 'dev'

function set_workspace_settings_to_dev() {
  export HELM_TYPE=dev
  export HELM_DEFAULT_PATH="${PATHS_PROJECT_DEPLOY_HOME}/helm"
  export HELM_CONTEXT="${PATHS_PROJECT_DEPLOY_HOME}/helm/${HELM_TYPE}"
  export K8S_ENV=eks-prod
  export KUBECONFIG=$HOME/.kube/config-ecosystem
  export TEST_TYPES=dev:acceptance:acceptance_mac:acceptance_windows
  export HATS=dev:pipeline
}
