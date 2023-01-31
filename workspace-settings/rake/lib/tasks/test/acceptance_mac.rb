require 'nexus'
require 'fileutils'
require 'socket'
require 'timeout'
require 'octokit_github'
require_relative 'acceptance_windows'
require_relative 'acceptance'
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
  branch_name = ENV["BASE_BRANCH"] || Common::Version.application_branch
  group_id = "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{branch_name}"
  replace_workstation_plugin_mac(group_name: group_id)
end

task :override_library do
  do_override_library
end

def do_override_library
  tanzu_environment = load_tanzu_env_json(@tanzu_env)
  puts "tanzu_environment is #{tanzu_environment}"
  libraryUrl = tanzu_environment[:libraryUrl] || tanzu_environment["libraryUrl"]
  environmentName = tanzu_environment[:environmentName] || tanzu_environment["environmentName"]
  count_file_path = "#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/#{environmentName}.txt"
  count = 0
  count = File.read(count_file_path).to_i if File.exist?(count_file_path)
  if count >= 1
    puts "skip override library because this environment used before"
    return
  end
  begin
    namespace = "mstr-env-#{environmentName}"
    get_pods_cmd = "kubectl get pods -n #{namespace} | grep \"library\""
    cloc_output = shell_output! "#{get_pods_cmd}"
    puts "cloc_output is #{cloc_output}"
    library_pod = cloc_output.split(" ")[0]
    puts "library_pod is #{library_pod}"
    override_file = "/usr/local/tomcat/webapps/MicroStrategyLibrary/WEB-INF/classes/config/configOverride.properties"
    echo_cmd = "bash -c \"echo '' >> #{override_file}\""
    edit_cmd = "kubectl exec #{library_pod} -n #{namespace} -- #{echo_cmd}"
    puts "edit_cmd is #{edit_cmd}"
    shell_command! "#{edit_cmd}"
    echo_cmd = "bash -c \"echo 'features.auth.applicationAuthModes.enabled=true' >> #{override_file}\""
    edit_cmd = "kubectl exec #{library_pod} -n #{namespace} -- #{echo_cmd}"
    puts "edit_cmd is #{edit_cmd}"
    shell_command! "#{edit_cmd}"
    puts "#{override_file} after modifed"
    shell_command! "kubectl exec #{library_pod} -n #{namespace} -- cat #{override_file}"
    #delete pods
    delete_pod = "kubectl delete pod #{library_pod} -n #{namespace}"
    shell_command! "#{delete_pod}"
    cloc_output = shell_output! "#{get_pods_cmd}"
    puts "cloc_output is #{cloc_output}"
    library_pod = cloc_output.split(" ")[0]
    puts "new library_pod is #{library_pod}"
    Tanzu.wait_on_service(service_name: environmentName, url: libraryUrl, endpoint: 'api/status', response_code: 200)
    #count usage
    tanzu_env_used_count(count_file_path)
  rescue => e
    error "exception from do_override_library:\n #{e}"
    raise "exception from do_override_library:\n #{e}"
    do_delete_tanzu_environment(environmentName)
  end
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
    libraryUrl, environmentName = prepare_for_workstation_test(@tanzu_env, @config_file, keywords=nil,replace_json=true)
    if libraryUrl.nil? || libraryUrl.empty?
      raise "invalid library url #{libraryUrl}"
    end
    info "====== Executing tests ======"
    app_path = "\'MicroStrategy Workstation\'"
    shell_command! "npm install --frozen-lockfile", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node #{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/trigger_test.js #{app_path} \'#{libraryUrl}/\' \'@Regression\' #{@cef_remote_debug_port} \'#{Common::Version.application_version}\'", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
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
