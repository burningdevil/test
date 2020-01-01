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

desc "Deploy the environment to kubernetes"
task :eks_deploy do
  library_ingress_host = library_service_fqdn
  override_values = "library.ingress.host=#{library_ingress_host}"
  eks_deploy(namespace: 'ci', release_name:workstation_setting_release_name, value_overrides: override_values, update_helm: false)
  helm_install_ready?(apps: "iserver mysql-md library", release: workstation_setting_release_name)
  info "Please access the swagger page of architect-service from url: http://#{library_service_fqdn}/MicroStrategyLibrary/"
end

@workstaion_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/.workstation"
@workstation_dmg_path = "#{@workstaion_folder}/workstation-mac.dmg"
@workstation_artifact_name = 'workstation-mac'
@workstaion_installation_folder = '/Applications/MicroStrategy Workstation.app'
@artifact_info = Compiler::Maven.artifact_info

def plugin_name_mapping(plugin_repo: $WORKSPACE_SETTINGS[:project][:name])
  plugin_minifest = OctokitGithub.client.contents("Kiai/workstation-mac", {:path => "production/macOS/manifest", :ref => Common::Version.application_branch})
  plugin_minifest_content = Base64.decode64(plugin_minifest["content"])
  manifest_hash = YAML.load(plugin_minifest_content)
  manifest_hash.each do |key,value|
    if value['artifact_id'] == plugin_repo
      return key
    end
  end
  warn "Plugin name is not found in the manifest file!"
end

def download_latest_workstation_mac_os_x
  FileUtils.rm(@workstation_dmg_path) if File.exist?(@workstation_dmg_path)
  Nexus.download_latest_artifact(file_path: @workstation_dmg_path, artifact_id: "#{@workstation_artifact_name}", group_id: "com.microstrategy.#{Common::Version.application_branch}", extra_coordinates: {e: 'dmg'})
end

def stop_workstaion_app_mac
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
  stop_workstaion_app_mac
  # Make sure no workstation installed
  if Dir.exist?("#{@workstaion_installation_folder}")
    puts "MicroStrategy Workstation has been installed, going to uninstall it..."
    FileUtils.rm_rf("#{@workstaion_installation_folder}")
  end
  puts "Install MicroStrategy Workstation..."
  shell_command! "hdiutil unmount '/Volumes/MicroStrategy - Workstation'" if Dir.exist?('/Volumes/MicroStrategy - Workstation')
  shell_command! "hdiutil mount #{@workstation_dmg_path}"
  shell_command! "cp -R '/Volumes/MicroStrategy - Workstation/MicroStrategy Workstation.app' '#{@workstaion_installation_folder}'"
  shell_command! "hdiutil unmount '/Volumes/MicroStrategy - Workstation'"
  FileUtils.rm(@workstation_dmg_path) if File.exist?(@workstation_dmg_path)

  workstation_plugin_version = ENV['APPLICATION_VERSION'] || Nexus.latest_artifact_version
  plugin_path = "#{@artifact_info[:output_dir]}/#{@artifact_info[:artifact_base_file_name]}.zip"
  download_artifact(@artifact_info[:artifact_base_file_name], workstation_plugin_version)

  plugin_name = plugin_name_mapping
  plugin_home_foler = "/Applications/MicroStrategy Workstation.app/Contents/Resources/Plugins"
  ws_plugin_folder = "#{plugin_home_foler}/#{plugin_name}"
  puts "Replacing the plugin of MicroStrategy Worstation..."
  FileUtils.rm_rf("#{ws_plugin_folder}/")
  FileUtils.cp(plugin_path, plugin_home_foler)
  shell_command! "unzip -o #{@artifact_info[:artifact_base_file_name]}.zip", cwd: plugin_home_foler
  FileUtils.mv("#{plugin_home_foler}/dist", "#{plugin_home_foler}/plugin_name")
  FileUtils.rm("#{plugin_home_foler}/#{@artifact_info[:artifact_base_file_name]}.zip")
end

def upload_test_result_to_nexus(result, platform)
  result_file_name = "test_result_#{platform}.json"
  begin
    tmp_dir = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/.uitest"
    FileUtils.rm_rf(tmp_dir, secure: true)
    FileUtils.mkdir_p(tmp_dir)
    result_file = "#{tmp_dir}/#{result_file_name}"
    File.new(result_file,"w+")

    test_result = {
      "result" => "#{result}"
    }.to_json

    File.open(result_file, 'w') {|file|
      file.write(test_result)
    }

    Nexus.upload_artifact(
      group_id:       "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{Common::Version.application_branch}"
      artifact_id:    @artifact_info[:artifact_base_file_name],
      artifact_ext:   'json',
      version:        @artifact_info[:artifact_version],
      repository:     $WORKSPACE_SETTINGS[:nexus][:repos][:release],
      artifact_path:  result_file,
      artifact_classifier: "test_result_#{platform}"
    )
  rescue => e
      warn e
  ensure
    FileUtils.rm_rf(tmp_dir, secure: true)
  end
end

task :replace_workstation_plugin_mac do
  download_latest_workstation_mac_os_x
  replace_workstation_plugin_mac
end

desc "run acceptance test oncucumber"
task :acceptance_test_mac do
  stop_workstaion_app_mac
  #make sure plist exists, if not, launch the MicroStrategy Workstation and quit
  workstation_plist = '~/Library/Preferences/com.microstrategy.Workstation.plist'
  if !shell_true? "ls #{workstation_plist}"
    start_workstation_app_mac
    stop_workstaion_app_mac
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
    exit_code=$?
    stop_workstaion_app_mac
    if exit_code == 0
      upload_test_result_to_nexus('pass', 'mac')
    else
      upload_test_result_to_nexus('fail', 'mac')
    end
    Helm.delete_release(workstation_setting_release_name)
  end
end