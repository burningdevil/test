{{/* Generate basic labels */}}
{{- define "product.labels" }}
product: {{.Chart.Name}}
release: {{ .Release.Name }}
{{- end }}

{{- define "namespace" }}
  {{- if ne .Release.Namespace "default" }}
namespace: {{ .Release.Namespace }}
  {{- else if .Values.global.namespace }}
namespace: {{ .Values.global.namespace }}
  {{- else }}
namespace: default
  {{- end }}
{{- end }}

{{- define "ingress_host" }}
  {{- if eq .Values.ingress.host "please_define" }}
- host: {{ .Chart.Name }}-{{ .Values.global.branch_name }}x.{{.Release.Namespace}}.internal.microstrategy.com
  {{- else }}
- host: {{ .Values.ingress.host }}
  {{- end }}
{{- end }}
