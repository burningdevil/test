
desc "test project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :test do
  caller_infos = caller.first.split(":")
  good "#{caller_infos[0]} : line #{caller_infos[1]}"
  good "Puts your test command here, for example mvn test or grable test: #{__FILE__}:#{__LINE__}"
end
