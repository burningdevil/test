require_relative 'acceptance_mac'
require 'nexus'
require 'fileutils'
require 'pry'

@artifact_info = Compiler::Maven.artifact_info
@wkstn_branch  = ENV['ghprbTargetBranch'] || Common::Version.application_branch
@workstation_zip_path = "#{@artifact_info[:output_dir]}/workstation-windows.zip"

def download_artifact(art_name, art_version)
  FileUtils.remove_entry_secure(@artifact_info[:output_dir], force: true )
  FileUtils.mkdir_p(@artifact_info[:output_dir])
  Nexus.download_large_artifact(artifact_id: art_name,group_id: "com.microstrategy.#{@wkstn_branch}", file_path: "#{@artifact_info[:output_dir]}/#{art_name}.zip" , version: art_version)
end

def download_snapshot_artifact(art_name, art_version)
  FileUtils.remove_entry_secure(@artifact_info[:output_dir], force: true )
  FileUtils.mkdir_p(@artifact_info[:output_dir])
  Nexus.download_large_artifact(artifact_id: art_name,group_id: "com.microstrategy.#{@wkstn_branch}", repository: 'Beta', file_path: "#{@artifact_info[:output_dir]}/#{art_name}.zip" , version: art_version)
end

def map_I
  info "====== mapping project home to volume I ======"
  shell_command!("cmd /c subst I: /D") if Dir.exist?('I:')
  shell_command!("cmd /c \"subst I: #{$WORKSPACE_SETTINGS[:paths][:project][:home]}\"")
end

def close_apps
  # kill workstation app and node process if already running
  info "====== Closing workstation app and node... ======"
  shell_command "taskkill /F /IM Workstation.exe" if shell_true?("tasklist| grep Workstation.exe")
  shell_command "taskkill /F /IM node.exe" if shell_true?("tasklist| grep node.exe")
end


task :install_workstation_windows do |t,args|
  info "====== installing workstation windows ======"
  product =  { 'name' => "MicroStrategy Workstation", 'artifact_name' => 'workstation-windows-ent', 'group_id' => 'com.microstrategy.m2021'}
  product['version'] = Nexus.latest_artifact_version(artifact_id: product['artifact_name'], group_id: product['group_id'])

  #clean environment
  shell_command! "git clean -dxf",cwd: $WORKSPACE_SETTINGS[:paths][:project][:home]
  close_apps

  #info "====== downloading workstation windows #{product['version']} ======"
  #download_artifact(product['artifact_name'], product['version'])
  FileUtils.remove_entry_secure(@artifact_info[:output_dir], force: true )
  FileUtils.mkdir_p(@artifact_info[:output_dir])
  FileUtils.rm(@workstation_zip_path) if File.exist?(@workstation_zip_path)
  Nexus.download_latest_artifact(file_path: @workstation_zip_path, artifact_id: product['artifact_name'], group_id: product['group_id'], extra_coordinates: {e: 'zip'})

  shell_command! "7z.exe x workstation-windows.zip -aoa", cwd: @artifact_info[:output_dir]

  # Install
  workstation_folder_name = shell_output! "ls #{@artifact_info[:output_dir]} | grep 'MicroStrategy Workstation'"
  workstation_folder_name = workstation_folder_name.strip
  base_path = (@artifact_info[:output_dir] + '/' + workstation_folder_name).gsub('/','\\')
  template_path = $WORKSPACE_SETTINGS[:paths][:project][:workspace][:settings][:rake][:lib][:templates][:home].gsub('/','\\')

  command = <<-EOH
  cmd /c "start /wait \"\" \"#{base_path}\\resources\\unpacked\\WindowsWorkstation.exe\" --ResponseFile=#{template_path}\\Response.ini -s -f1\"#{base_path}\\resources\\unpacked\\setup.iss\" -f2\"#{base_path}\\setup.log\" "
  EOH
  info "installing microstrategy workstation \n#{command.lstrip!}"

  begin
    shell_command! command
  rescue Exception => e
    error e
    raise "workstation installation failed"
  ensure
    shell_command! "tail 'C:/Program Files/MicroStrategy/Workstation/MicroStrategyWorkstationInstall.log'"
  end

  # update db
  appdata_location = "#{ENV['LOCALAPPDATA']}\\MicroStrategy_Inc".gsub("\\",'/')
  FileUtils.mkdir_p(appdata_location)

  info "====== AppData localtion: #{appdata_location} ======"
  # update user
  Dir.glob("#{appdata_location}/**/user.config").each do |user_config|
    info "find user config at #{user_config}"
    next unless user_config.include?(product['version'].split('.').last)
    info "updating user config at #{user_config}"
    FileUtils.cp_r("#{$WORKSPACE_SETTINGS[:paths][:project][:workspace][:settings][:rake][:lib][:templates][:home]}/user.config", user_config, remove_destination: true)
  end
end

task :replace_plugin_windows, [:plugin_version] do |t,args|
  info "====== replacing plugin ======"
  # replace plugin
  plugin = { 'name' => plugin_name_mapping || @artifact_info[:artifact_base_file_name] }
  plugin['version'] =  args[:plugin_version] || ENV['APPLICATION_VERSION']
  plugin_path = "C:/Program Files/MicroStrategy/Workstation/Plugins/#{plugin['name']}"
  FileUtils.mkdir_p(plugin_path) unless File.exists?(plugin_path)

  if ENV['JENKINS_STAGE'] == 'premerge'
    info "====== PREMERGE Job, no need to download plugin... ======"
    FileUtils.rm_rf(plugin_path, secure: true)
    FileUtils.mv("#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/dist", plugin_path)
  else
    download_snapshot_artifact(@artifact_info[:artifact_base_file_name], plugin['version'])
    FileUtils.rm_rf(plugin_path, secure: true)
    shell_command! "7z x #{@artifact_info[:artifact_base_file_name]}.zip -aoa",cwd: @artifact_info[:output_dir]
    FileUtils.mv("#{@artifact_info[:output_dir]}/dist", plugin_path)
  end

end

def stop_winappdriver()
  begin
    info "====== stopping WinAppDriver ======"
    system("taskkill /F /IM WinAppDriver.exe")
  rescue
    info "====== Continue test ======"
  end
end

def uninstall_winappdriver
  begin
    info "====== uninstalling winAppDriver ======"
    winapp_id = shell_output! "wmic product get name, IdentifyingNumber | grep -i winappdriver"
    winapp_id = winapp_id.split.first.strip
    print "winappdriver id: #{winapp_id}\n Uninstalling winappdriver"
    shell_command! "msiexec /x #{winapp_id} /q"
  rescue
  end
end

task :acceptance_test_win do |t,args|
  #stop_winappdriver
  #uninstall_winappdriver
  map_I
  workstation_path = "C:\\Program Files\\MicroStrategy\\Workstation\\Workstation.exe"
  close_apps

  shell_command! "powershell -command 'Get-DisplayResolution'"
  shell_command! "powershell -command 'Set-DisplayResolution -Width 1920 -Height 1080 -Force'"
  shell_command! "powershell -command 'Get-DisplayResolution'"

  info "====== yarn install starting ======"
  shell_command! "yarn install --frozen-lockfile", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
  shell_command! 'yarn config set script-shell "C:/usr/bin/bash"', environment: {'MSYS' => 'winsymlinks:nativestrict'}

  info "====== starting test ======"
  begin
    shell_command! "node trigger_test.js  \"#{workstation_path}\"  \"http://#{library_service_fqdn}/MicroStrategyLibrary/\" \"@Regression\" 54213", cwd: "I:/tests/acceptance"
  ensure
    close_apps
    Helm.delete_release(workstation_setting_release_name)
  end
end
