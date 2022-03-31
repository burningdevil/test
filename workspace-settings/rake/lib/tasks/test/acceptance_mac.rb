require 'nexus'
require 'fileutils'
require 'socket'
require 'timeout'
require 'octokit_github'
require_relative 'acceptance_windows'

desc "Deploy the environment to kubernetes"
task :eks_deploy do
  info "=== Deploy test servers ==="
  library_ingress_host = library_service_fqdn
  iserver_rest_ingress_host = iserver_service_fqdn
  base_image_version = "#{get_base_image_branch}-.-latest"
  puts "base_image_version is #{base_image_version}"
  override_values = "library.ingress.host=#{library_ingress_host},"+
                    "iserver.image.version=#{base_image_version},"+
                    "library.image.version=#{base_image_version},"+
                    "iserver.ingress.host=#{iserver_rest_ingress_host}"

  eks_deploy_workstation(override_values)
end

@workstation_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.workstation"
@workstation_dmg_path = "#{@workstation_folder}/workstation-mac.dmg"
@workstation_artifact_name = 'workstation-mac'
@workstation_installation_folder = '/Applications/MicroStrategy Workstation.app'
@artifact_info = Compiler::Maven.artifact_info
@cef_remote_debug_port = 54213

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
  stop_workstation_app_mac
  #make sure plist is clean
  workstation_plist = '~/Library/Preferences/com.microstrategy.Workstation.plist'
  if shell_true? "ls #{workstation_plist}"
    shell_command! "rm #{workstation_plist}"
    # clean cache
    shell_command! "killall cfprefsd"
    sleep(10)
  end
  start_workstation_app_mac
  stop_workstation_app_mac
  sleep(5)

  find_avaliable_cef_port

  info "====== Enabling develop mode for workstation ======"
  shell_command! "defaults write com.microstrategy.Workstation IsDeveloperMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation IsCEFPluginMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation CefRemoteDebuggingPort -integer #{@cef_remote_debug_port}"
  shell_command! "defaults read com.microstrategy.Workstation"

  begin
    info "====== Executing tests ======"
    app_path = "\'MicroStrategy Workstation\'"
    shell_command! "yarn install --frozen-lockfile", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node #{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/trigger_test.js #{app_path} \'https://#{library_service_fqdn}/MicroStrategyLibrary/\' \'@Regression\' #{@cef_remote_debug_port} \'#{ENV['APPLICATION_VERSION']}\'", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    #update test result to rally
    shell_command! "node rally/updateE2EResultsToClientAutoData.js -c \"#{ENV['APPLICATION_VERSION']}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node rally/updateE2EResultsToRally.js -c \"#{ENV['APPLICATION_VERSION']}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    post_process_mac("pass")
  rescue => e
    #update test result to rally
    shell_command! "node rally/updateE2EResultsToClientAutoData.js -c \"#{ENV['APPLICATION_VERSION']}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node rally/updateE2EResultsToRally.js -c \"#{ENV['APPLICATION_VERSION']}\" \"#{ENV['BUILD_URL']}\"", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    error "exception from test:\n #{e}"
    post_process_mac("fail")
  end
end
