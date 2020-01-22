#!/usr/bin/env bash

register_workspace_setting 'test'

function set_workspace_settings_to_test() {
  export HELM_TYPE=test
  export HELM_DEFAULT_PATH="${PATHS_PROJECT_DEPLOY_HOME}/helm"
  export HELM_CONTEXT="${PATHS_PROJECT_DEPLOY_HOME}/helm/${HELM_TYPE}"
  export K8S_ENV=eks-prod
  export KUBECONFIG=$HOME/.kube/config-ecosystem
  export TEST_TYPES=acceptance
  export HATS=test
}
