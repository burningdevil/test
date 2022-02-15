{{/* Generate basic labels */}}
{{- define "product.labels" }}
product: {{.Chart.Name}}
relesename: {{ .Release.Name }}
{{- end }}

{{- define "namespace" }}
  {{- if .Release.Namespace }}
namespace: {{ .Release.Namespace }}
  {{- else if .Values.global.namespace }}
namespace: {{ .Values.global.namespace }}
  {{- else }}
namespace: default
  {{- end }}
{{- end }}
