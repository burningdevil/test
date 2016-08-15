require 'compiler/maven'

raise "edit below with specifics for this project:
  replace jar with your artifact version
  replace the output location with where your artifact is built to
"
Compiler::Maven.artifact_info(
  artifact_file_extension: "the file extension of the artifact: zip, jar, war, etc...",
  output_dir: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/TKN-.-project_name-.-TKN/.build/...",
)