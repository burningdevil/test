
task :prepush_test => [:rt_deploy]
task :upload => [:prepush_test]