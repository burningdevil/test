# MicroStratey Library

MicroStrategy Library is an interactive application of the MicroStrategy Business Intelligence platform that lets business users harness the analytical power of MicroStrategy in a simple, clean, and modern user interface.

## Prerequisites
  - Kubernetes 1.6+

## Install
To install the chart with the release name `my-release`:
```console
$ helm install --name my-release mstr-charts/library
```
Dry-run and Debug mode:
```console
$ helm install mstr-charts/library --dry-run --debug
```
To uninstall/delete the `my-release` deployment:

```console
$ helm delete my-release
```
The command removes all the Kubernetes components associated with the chart and deletes the release. If you want to remove the release from the store and make its name free for later, add "--purge"

```console
$ helm delete my-release --purge
```

## Configuration

The following table lists the configurable parameters of the this chart and their default values.

Parameter | Description | Default
--- | --- | ---
`global.namespace` | the namespace to deploy this application | `default`
`replicaCount` | the replica count of the deployment | `1`
`image.repository` | the repository of library image | `899557540756.dkr.ecr.us-east-1.amazonaws.com/library`
`image.version` | the version of library image | `latest`
`image.pullPolicy` | the image pull policy | `Always`
`service.type` | the service type | `ClusterIP`
`ingress.enabled` | if need to create ingress | `true`
`ingress.host` | the host name in ingress | `{{ .Chart.Name }}-{{ .Release.Name }}.{{.Release.Namespace}}.internal.microstrategy.com`
