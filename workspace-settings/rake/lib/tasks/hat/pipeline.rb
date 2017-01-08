Rake::Task[:upload].clear_prerequisites

desc "deploy project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :deploy, :version do |t, args|
  caller_infos = caller.first.split(":")
  good "#{caller_infos[0]} : line #{caller_infos[1]}"
  good "Puts deployment code here: #{__FILE__}:#{__LINE__}"
end
