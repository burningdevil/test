require 'nexus'
require 'fileutils'
require 'socket'
require 'timeout'
require 'octokit_github'
require_relative 'acceptance_windows'

def workstation_setting_release_name
  "#{$WORKSPACE_SETTINGS[:project][:name]}-#{Common::Version.application_branch}-#{ENV['WS_TEST_PLATFORM']}-#{ENV['HELM_TYPE']}".gsub('.', '-').gsub('_', '-').downcase
end

def library_service_fqdn
  "library-#{workstation_setting_release_name}.internal.microstrategy.com"
end

def architect_service_fqdn
  "architect-service-#{workstation_setting_release_name}.internal.microstrategy.com"
end

desc "Deploy the environment to kubernetes"
task :eks_deploy do
  info "=== Deploy test servers ==="
  library_ingress_host = library_service_fqdn
  architect_service_ingress_host = architect_service_fqdn

  override_values = "library.ingress.host=#{library_ingress_host},"+
                    "architect-service.ingress.host=#{architect_service_ingress_host}"

  eks_deploy(namespace: 'ci', release_name:workstation_setting_release_name, value_overrides: override_values, update_helm: false)
  helm_install_ready?(apps: "iserver mysql-md library", release: workstation_setting_release_name)
  info "Please access the swagger page of web-dossier from url: https://#{library_service_fqdn}/MicroStrategyLibrary/"
end

@workstation_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.workstation"
@workstation_dmg_path = "#{@workstation_folder}/workstation-mac.dmg"
@workstation_artifact_name = 'workstation-mac'
@workstation_installation_folder = '/Applications/MicroStrategy Workstation.app'
@artifact_info = Compiler::Maven.artifact_info
@cef_remote_debug_port = 54213

def plugin_name_mapping(plugin_repo: $WORKSPACE_SETTINGS[:project][:name])
  plugin_minifest = OctokitGithub.client.contents("Kiai/workstation-mac", {:path => "production/macOS/manifest", :ref => @wkstn_branch })
  plugin_minifest_content = Base64.decode64(plugin_minifest["content"])
  manifest_hash = YAML.load(plugin_minifest_content)
  manifest_hash.each do |key,value|
    if value['artifact_id'] == plugin_repo
      return key
    end
  end
  warn "Plugin name is not found in the manifest file!"
  return nil
end

def download_latest_workstation_mac_os_x
  info "====== Dowloading workstation mac ======"
  FileUtils.rm(@workstation_dmg_path) if File.exist?(@workstation_dmg_path)
  Nexus.download_latest_artifact(file_path: @workstation_dmg_path, artifact_id: "#{@workstation_artifact_name}", group_id: "com.microstrategy.#{@wkstn_branch}", extra_coordinates: {e: 'dmg'})
end

def stop_workstation_app_mac
  # Make sure MicroStrategy Workstation is not running
  if !shell_true? "ps -ef | grep -i workstation |  grep -v grep"
    info "====== It looks good, MicroStrategy Workstation is not running. ======"
  else
    info "====== Stopping MicroStrategy Workstation... ======"
    app_name = "MicroStrategy Workstation.app"
    begin
      shell_command! "osascript -e 'quit app \"#{app_name}\"'"
    rescue
      warn "====== Failed to terminate MicroStrategy Workstation with osascript. Going to kill the process! ======"
    end
    if shell_true? "ps -ef | grep -i workstation |  grep -v grep"
      begin
        pid_ws = shell_output! "pgrep 'MicroStrategy Workstation'"
      rescue
        good "MicroStrategy Workstation is terminated successfully"
      end
      if pid_ws
        pid_ws = pid_ws.split()
        pid_ws.each do |pid|
          begin
            shell_command! "kill -9 #{pid}"
          rescue
            warn "The process id is not found: #{pid}"
          end
        end
      end
    end
  end
end

def start_workstation_app_mac
  info "====== Starting workstation mac... ======"
  shell_command! "sudo xattr -r -d com.apple.quarantine '/Applications/MicroStrategy Workstation.app/'" if shell_true? "xattr '/Applications/MicroStrategy Workstation.app/' | grep 'com.apple.quarantine'"
  shell_command! "open '/Applications/MicroStrategy Workstation.app'"
end

def is_port_open?(ip, port)
  begin
    Timeout::timeout(10) do
      begin
        s = TCPSocket.new(ip, port)
        s.close
        return true
      rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH
        return false
      end
    end
  rescue Timeout::Error
  end
  return false
end

def install_latest_workstation_mac_os_x
  info "====== Dowloading workstation mac ======"
  FileUtils.rm(@workstation_dmg_path) if File.exist?(@workstation_dmg_path)
  Nexus.download_latest_artifact(file_path: @workstation_dmg_path, artifact_id: "#{@workstation_artifact_name}", group_id: "com.microstrategy.#{@wkstn_branch}", extra_coordinates: {e: 'dmg'})

  stop_workstation_app_mac
  # Make sure no workstation installed
  if Dir.exist?("#{@workstation_installation_folder}")
    puts "MicroStrategy Workstation has been installed, going to uninstall it..."
    FileUtils.rm_rf("#{@workstation_installation_folder}")
  end
  puts "Install MicroStrategy Workstation..."
  shell_command! "hdiutil unmount '/Volumes/MicroStrategy - Workstation'" if Dir.exist?('/Volumes/MicroStrategy - Workstation')
  shell_command! "hdiutil mount #{@workstation_dmg_path}"
  shell_command! "cp -R '/Volumes/MicroStrategy - Workstation/MicroStrategy Workstation.app' '#{@workstation_installation_folder}'"
  shell_command! "hdiutil unmount '/Volumes/MicroStrategy - Workstation'"
  FileUtils.rm(@workstation_dmg_path) if File.exist?(@workstation_dmg_path)
end

def replace_workstation_plugin_mac

  if ENV['JENKINS_STAGE'] == 'premerge'
    info "====== PREMERGE Job, no need to download plugin... ======"
    plugin_path="#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/.build/#{$WORKSPACE_SETTINGS[:project][:name]}-#{Common::Version.application_version}.zip"
  else
    workstation_plugin_version = ENV['APPLICATION_VERSION'] || Nexus.latest_artifact_version
    plugin_path = "#{@artifact_info[:output_dir]}/#{@artifact_info[:artifact_base_file_name]}.zip"
    info "====== Downloading plugin #{@artifact_info[:artifact_base_file_name]} with version #{workstation_plugin_version} ======"
    download_snapshot_artifact(@artifact_info[:artifact_base_file_name], workstation_plugin_version)
  end

  plugin_name = plugin_name_mapping || "#{$WORKSPACE_SETTINGS[:project][:name]}"
  plugin_home_foler = "/Applications/MicroStrategy Workstation.app/Contents/Resources/Plugins"
  ws_plugin_folder = "#{plugin_home_foler}/#{plugin_name}"
  info "====== Replacing the plugin of MicroStrategy Worstation... ======"
  #FileUtils.mkdir_p(ws_plugin_folder) unless File.exists?(ws_plugin_folder)
  FileUtils.rm_rf("#{ws_plugin_folder}/")
  FileUtils.cp(plugin_path, plugin_home_foler)
  shell_command! "unzip -o #{@artifact_info[:artifact_base_file_name]}.zip", cwd: plugin_home_foler
  FileUtils.mv("#{plugin_home_foler}/dist", "#{ws_plugin_folder}")
  FileUtils.rm("#{plugin_home_foler}/#{@artifact_info[:artifact_base_file_name]}.zip")
end

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
    shell_command! "node #{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/trigger_test.js #{app_path} \'https://#{library_service_fqdn}/MicroStrategyLibrary/\' \'@PREMERGE\' #{@cef_remote_debug_port}", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
  ensure
    stop_workstation_app_mac
    Helm.delete_release(workstation_setting_release_name)
  end
end
