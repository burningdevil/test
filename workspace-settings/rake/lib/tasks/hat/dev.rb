require 'shell-helper'
require 'common/version'

include ShellHelper::Shell

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :build do
  node_modules_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/workstation-architect/production/node_modules"
  FileUtils.rm_rf(node_modules_folder) if File.exist?(build_folder)
  shell_command!(
    'docker run -v /Users/chwu/Projects/microstrategy/kiai/workstation-architect/production:/mnt/production --entrypoint "/bin/sh" node:10-alpine /mnt/production/build.sh',
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
end

desc "package project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :package => [:build] do
  build_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/workstation-architect/.build"
  FileUtils.rm_rf(build_folder) if File.exist?(build_folder)
  FileUtils.mkdir_p(build_folder) unless File.exist?(build_folder)
  shell_command!(
    "zip -r #{build_folder}/#{$WORKSPACE_SETTINGS[:project][:name]}-#{Common::Version.application_version}.zip ./",
    cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/dist"
  )
end
