require 'shell-helper'
require 'common/version'

include ShellHelper::Shell

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :build do
  good "Puts your build command here, for example mvn compile or grable build"
end

desc "test project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :test do
  good "Puts your test command here, for example mvn test or grable test"
end


desc "package project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :package do
  good "Puts your pacakge command here."
end

desc "deploy project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :deploy, :version do |t, args|
  good "Puts deployment code here."
end
