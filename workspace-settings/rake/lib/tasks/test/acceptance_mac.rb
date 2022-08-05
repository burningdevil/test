require 'nexus'
require 'fileutils'
require 'socket'
require 'timeout'
require 'octokit_github'
require_relative 'acceptance_windows'
require 'tanzu'
require 'common/version'

@workstation_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.workstation"
@workstation_dmg_path = "#{@workstation_folder}/workstation-mac.dmg"
@workstation_artifact_name = 'workstation-mac'
@workstation_installation_folder = '/Applications/MicroStrategy Workstation.app'
@artifact_info = Compiler::Maven.artifact_info
@cef_remote_debug_port = 54213
@config_file = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/protractorArgs.json"
@mstrbakUrl = "s3://mci-dev-mstrbak/workstation-home-admin-ci-mstrbak.tar.gz"
@tanzu_env = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/tanzu-env.json"

task :install_latest_workstation_mac_os_x do
  install_latest_workstation_mac_os_x
end

task :replace_workstation_plugin_mac do
  replace_workstation_plugin_mac
end

def is_port_avaliable?(port)
  cmd = shell_command "netstat -vanp tcp | grep #{port}"
  cmd.stdout == ''
end

def find_avaliable_cef_port
  while(!is_port_avaliable?(@cef_remote_debug_port)) do
    @cef_remote_debug_port += 1
  end
  info "====== PORT #{@cef_remote_debug_port} is avaliable for test ======"
end

desc "run acceptance test on cucumber"
task :acceptance_test_mac do
  stop_workstaion_app_mac
  #make sure plist is clean
  workstation_plist = '~/Library/Preferences/com.microstrategy.Workstation.plist'
  if shell_true? "ls #{workstation_plist}"
    shell_command! "rm #{workstation_plist}"
    # clean cache
    shell_command! "killall cfprefsd"
    sleep(10)
  end

  start_workstation_app_mac
  stop_workstaion_app_mac
  sleep(5)

  find_avaliable_cef_port

  info "====== Enabling develop mode for workstation ======"
  shell_command! "defaults write com.microstrategy.Workstation IsDeveloperMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation IsCEFPluginMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation CefRemoteDebuggingPort -integer #{@cef_remote_debug_port}"
  #US417343; enable preview feature by default
  customize_preferences = "<dict><key>preview-features</key><true/><key>support-info-window</key><true/><key>use-richtextbox</key><true/><key>use-microchart</key><true/></dict>"
  shell_command! "defaults write com.microstrategy.Workstation ExtraPreferences -dict-add workstation '#{customize_preferences}'"
  shell_command! "defaults read com.microstrategy.Workstation"

  environmentName = ""
  begin
    libraryUrl, environmentName = prepare_for_workstation_test(@tanzu_env, @config_file)
    if libraryUrl.nil? || libraryUrl.empty?
      raise "invalid library url #{libraryUrl}"
    end
    info "====== Executing tests ======"
    app_path = "\'MicroStrategy Workstation\'"
    shell_command! "npm install --frozen-lockfile", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node #{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/trigger_test.js #{app_path} \'#{libraryUrl}\' \'@Regression\' #{@cef_remote_debug_port} \'#{Common::Version.application_version}\'", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    #update test result to rally
    shell_command! "node rally/updateE2EResultsToClientAutoData.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node rally/updateE2EResultsToRally.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    do_delete_tanzu_environment(environmentName)
    post_process_workstation_ci(result:"pass", update_nexus:true, update_rally:false, coverage_report:false, platform:'mac', platform_os:nil)
  rescue => e
    #update test result to rally
    shell_command! "node rally/updateE2EResultsToClientAutoData.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node rally/updateE2EResultsToRally.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    error "exception from test:\n #{e}"
    do_delete_tanzu_environment(environmentName)
    post_process_workstation_ci(result:"fail", update_nexus:true, update_rally:false, coverage_report:false, platform:"mac", platform_os:nil)
  end
end
