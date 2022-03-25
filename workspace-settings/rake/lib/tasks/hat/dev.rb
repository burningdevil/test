require 'shell-helper'
require 'common/version'

include ShellHelper::Shell

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :build do
  node_modules_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/node_modules"
  app_locale_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/src/locale"
  menu_locale_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/src/assets/i18n"

  FileUtils.rm_rf(node_modules_folder) if File.exist?(node_modules_folder)
  FileUtils.mkdir_p(app_locale_folder) unless File.exist?(app_locale_folder)
  FileUtils.mkdir_p(menu_locale_folder) unless File.exist?(menu_locale_folder)

  app_database_name = $WORKSPACE_SETTINGS[:project][:name].upcase.gsub('-', '_')
  shell_command!(
    "docker run -v #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}:/mnt/production -e APP_DATABASE_NAME=#{app_database_name} --entrypoint '/bin/sh' maven:alpine /mnt/production/i18n.sh",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
  shell_command!(
    "docker run -v #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}:/mnt/production -e APPLICATION_VERSION=#{Common::Version.application_version} --entrypoint '/bin/sh' node:12-alpine /mnt/production/build.sh",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
#   shell_command!(
#     "npm run metrics",
#     cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
#   )
end

desc "package project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :package => [:build] do
  build_folder = Compiler::Maven.artifact_info[:output_dir]
  FileUtils.rm_rf(build_folder) if File.exist?(build_folder)
  FileUtils.mkdir_p(build_folder) unless File.exist?(build_folder)
  shell_command!(
    "zip -r #{build_folder}/#{$WORKSPACE_SETTINGS[:project][:name]}-#{Common::Version.application_version}.zip dist",
    cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  )
end