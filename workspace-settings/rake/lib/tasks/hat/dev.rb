require 'shell-helper'
require 'common/version'

include ShellHelper::Shell

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :build do
  caller_infos = caller.first.split(":")
  good "#{caller_infos[0]} : line #{caller_infos[1]}"
  good "Puts your build command here, for example mvn compile or grable build"
end

desc "package project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :package do
  good "Puts your pacakge command here: #{__FILE__}:#{__LINE__}"
end
