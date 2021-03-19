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

  library_ingress_host = library_service_fqdn
  architect_service_ingress_host = architect_service_fqdn

  override_values = "library.ingress.host=#{library_ingress_host},"+
                    "architect-service.ingress.host=#{architect_service_ingress_host}"

  eks_deploy(namespace: 'ci', release_name:workstation_setting_release_name, value_overrides: override_values, update_helm: false)
  helm_install_ready?(apps: "iserver mysql-md library", release: workstation_setting_release_name)
  info "Please access the swagger page of web-dossier from url: http://#{library_service_fqdn}/MicroStrategyLibrary/"
end

@workstation_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.workstation"
@workstation_dmg_path = "#{@workstation_folder}/workstation-mac.dmg"
@workstation_artifact_name = 'workstation-mac'
@workstation_installation_folder = '/Applications/MicroStrategy Workstation.app'
@artifact_info = Compiler::Maven.artifact_info

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
  FileUtils.rm(@workstation_dmg_path) if File.exist?(@workstation_dmg_path)
  Nexus.download_latest_artifact(file_path: @workstation_dmg_path, artifact_id: "#{@workstation_artifact_name}", group_id: "com.microstrategy.#{@wkstn_branch}", extra_coordinates: {e: 'dmg'})
end

def stop_workstation_app_mac
  # Make sure MicroStrategy Workstation is not running
  if !shell_true? "ps -ef | grep -i workstation |  grep -v grep"
    puts "It looks good, MicroStrategy Workstation is not running."
  else
    puts "Stopping MicroStrategy Workstation..."
    app_name = "MicroStrategy Workstation.app"
    begin
      shell_command! "osascript -e 'quit app \"#{app_name}\"'"
    rescue
      warn "Failed to terminate MicroStrategy Workstation with osascript. Going to kill the process!"
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

def replace_workstation_plugin_mac
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

  if ENV['JENKINS_STAGE'] == 'premerge'
    puts "PREMERGE Job, no need to download plugin..."
    plugin_path="#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/.build/#{$WORKSPACE_SETTINGS[:project][:name]}-#{Common::Version.application_version}.zip"
  else
    workstation_plugin_version = ENV['APPLICATION_VERSION'] || Nexus.latest_artifact_version
    plugin_path = "#{@artifact_info[:output_dir]}/#{@artifact_info[:artifact_base_file_name]}.zip"
    download_snapshot_artifact(@artifact_info[:artifact_base_file_name], workstation_plugin_version)
  end

  plugin_name = plugin_name_mapping || "#{$WORKSPACE_SETTINGS[:project][:name]}"
  plugin_home_foler = "/Applications/MicroStrategy Workstation.app/Contents/Resources/Plugins"
  ws_plugin_folder = "#{plugin_home_foler}/#{plugin_name}"
  puts "Replacing the plugin of MicroStrategy Worstation..."
  FileUtils.mkdir_p(ws_plugin_folder) unless File.exists?(ws_plugin_folder)
  FileUtils.rm_rf("#{ws_plugin_folder}/")
  FileUtils.cp(plugin_path, plugin_home_foler)
  shell_command! "unzip -o #{plugin_path}", cwd: plugin_home_foler
  FileUtils.mv("#{plugin_home_foler}/dist", "#{ws_plugin_folder}")
  FileUtils.rm("#{plugin_home_foler}/#{plugin_path.split('/').last}")
end

task :replace_workstation_plugin_mac do

  download_latest_workstation_mac_os_x
  replace_workstation_plugin_mac
end

desc "run acceptance test oncucumber"
task :acceptance_test_mac do
  stop_workstation_app_mac
  #make sure plist exists, if not, launch the MicroStrategy Workstation and quit
  workstation_plist = '~/Library/Preferences/com.microstrategy.Workstation.plist'
  if !shell_true? "ls #{workstation_plist}"
    start_workstation_app_mac
    stop_workstation_app_mac
    sleep(5)
  end
  shell_command! "defaults write com.microstrategy.Workstation IsDeveloperMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation IsCEFPluginMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation CefRemoteDebuggingPort -integer 54213"
  shell_command! "defaults read com.microstrategy.Workstation"
  begin
    app_path = "\'MicroStrategy Workstation\'"
    shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node #{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/trigger_test.js #{app_path} \'http://#{library_service_fqdn}/MicroStrategyLibrary/\' \'@PREMERGE\'", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
  ensure
    stop_workstation_app_mac
    Helm.delete_release(workstation_setting_release_name)
  end
end

desc "run acceptance test oncucumber"
task :acceptance_test_mac_premerge do
  stop_workstation_app_mac
  #make sure plist exists, if not, launch the MicroStrategy Workstation and quit
  workstation_plist = '~/Library/Preferences/com.microstrategy.Workstation.plist'
  if !shell_true? "ls #{workstation_plist}"
    start_workstation_app_mac
    stop_workstation_app_mac
    sleep(5)
  end
  shell_command! "defaults write com.microstrategy.Workstation IsDeveloperMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation IsCEFPluginMode -boolean YES"
  shell_command! "defaults write com.microstrategy.Workstation CefRemoteDebuggingPort -integer 54213"
  shell_command! "defaults read com.microstrategy.Workstation"
  begin
    app_path = "\'MicroStrategy Workstation\'"
    shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! "node #{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/trigger_test.js #{app_path} \'http://#{library_service_fqdn}/MicroStrategyLibrary/\' \'@PREMERGE\'", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
  ensure
    stop_workstation_app_mac
    Helm.delete_release(workstation_setting_release_name)
  end
end
