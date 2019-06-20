require 'shell-helper'
require 'common/version'

include ShellHelper::Shell

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :build do
  shell_command!(
    'docker run -v /Users/chwu/Projects/microstrategy/kiai/workstation-architect/production:/mnt/production -v /mnt/production/node_modules --entrypoint "/bin/sh" -it node:10-alpine /mnt/production/build.sh',
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
end

desc "package project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :package => [:build] do
  shell_command!(
    "zip -r ../#{$WORKSPACE_SETTINGS[:project][:name]}-#{Common::Version.application_version}.zip ./",
    cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/dist"
  )
end
