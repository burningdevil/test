
task :prepush_test => [:rt_deploy]
task :upload => [:prepush_test]

desc "deploy project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :deploy, :version do |t, args|
  good "Puts deployment code here."
end
