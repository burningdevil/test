require_relative 'acceptance_mac'
require 'nexus'
require 'fileutils'
require 'pry'

@artifact_info = Compiler::Maven.artifact_info
@wkstn_branch  = ENV['ghprbTargetBranch'] || Common::Version.application_branch

def download_artifact(art_name, art_version)
  FileUtils.remove_entry_secure(@artifact_info[:output_dir], force: true )
  FileUtils.mkdir_p(@artifact_info[:output_dir])
  Nexus.download_large_artifact(artifact_id: art_name,group_id: "com.microstrategy.#{@wkstn_branch}", file_path: "#{@artifact_info[:output_dir]}/#{art_name}.zip" , version: art_version)
end

def map_I
  shell_command!("cmd /c subst I: /D") if Dir.exist?('I:')
  shell_command!("cmd /c \"subst I: #{$WORKSPACE_SETTINGS[:paths][:project][:home]}\"")
end

def close_apps
  # kill workstation app and node process if already running
  shell_command "taskkill /F /IM Workstation.exe" if shell_true?("tasklist| grep Workstation.exe")
  shell_command "taskkill /F /IM node.exe" if shell_true?("tasklist| grep node.exe")
end


task :install_workstation_windows do |t,args|
  product =  { 'name' => "MicroStrategy Workstation", 'artifact_name' => 'workstation-windows'}
  product['version'] = Nexus.latest_artifact_version(artifact_id: product['artifact_name'])

  #clean environment
  shell_command! "git clean -dxf",cwd: $WORKSPACE_SETTINGS[:paths][:project][:home]
  close_apps

  download_artifact('workstation-windows', product['version'])

  shell_command! "7z.exe x workstation-windows.zip -aoa", cwd: @artifact_info[:output_dir]

  # Install
  base_path = (@artifact_info[:output_dir] + '/' + product['name'] + ' ' + product['version'].split('.')[0..2].map(&:to_i).join('.')).gsub('/','\\')
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

  # update user
  Dir.glob("#{appdata_location}/**/user.config").each do |user_config|
    next unless user_config.include?(product['version'].split('.').last)
    info "updating user config at #{user_config}"
    FileUtils.cp_r("#{$WORKSPACE_SETTINGS[:paths][:project][:workspace][:settings][:rake][:lib][:templates][:home]}/user.config", user_config, remove_destination: true)
  end
end

task :replace_plugin_windows, [:plugin_version] do |t,args|
  # replace plugin
  plugin = { 'name' => plugin_name_mapping || @artifact_info[:artifact_base_file_name] }
  plugin['version'] =  args[:plugin_version] || Nexus.latest_artifact_version
  plugin_path = "C:/Program Files/MicroStrategy/Workstation/Plugins/#{plugin['name']}"
  FileUtils.mkdir_p(plugin_path) unless File.exists?(plugin_path)

  if ENV['JENKINS_STAGE'] == 'premerge'
    puts "PREMERGE Job, no need to download plugin..."
    FileUtils.rm_rf(plugin_path, secure: true)
    FileUtils.mv("#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/dist", plugin_path)
  else
    download_artifact(@artifact_info[:artifact_base_file_name], plugin['version'])
    FileUtils.rm_rf(plugin_path, secure: true)
    shell_command! "7z x #{@artifact_info[:artifact_base_file_name]}.zip -aoa",cwd: @artifact_info[:output_dir]
    FileUtils.mv("#{@artifact_info[:output_dir]}/dist", plugin_path)
  end

end

task :acceptance_test_win do |t,args|
  map_I
  workstation_path = "C:\\Program Files\\MicroStrategy\\Workstation\\Workstation.exe"
  close_apps
  sleep 10
  shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
  shell_command! 'yarn config set script-shell "C:/usr/bin/bash"', environment: {'MSYS' => 'winsymlinks:nativestrict'}

  begin
    shell_command! "node trigger_test.js  \"#{workstation_path}\"  \"http://#{library_service_fqdn}/MicroStrategyLibrary/\" \"@PREMERGE\"", cwd: "I:/tests/acceptance"
    upload_test_result_to_nexus('pass','win')
  rescue
    upload_test_result_to_nexus('fail', 'win')
    raise "UI tests failed, please refer the log for more details"
  ensure
    close_apps
    Helm.delete_release(workstation_setting_release_name)
  end
end

task :acceptance_test_win_premerge do |t,args|
  map_I
  workstation_path = "C:\\Program Files\\MicroStrategy\\Workstation\\Workstation.exe"
  close_apps
  sleep 10
  shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
  shell_command! 'yarn config set script-shell "C:/usr/bin/bash"', environment: {'MSYS' => 'winsymlinks:nativestrict'}

  begin
    shell_command! "node trigger_test.js  \"#{workstation_path}\"  \"http://#{library_service_fqdn}/MicroStrategyLibrary/\" \"@PREMERGE\"", cwd: "I:/tests/acceptance"
  ensure
    close_apps
    Helm.delete_release(workstation_setting_release_name)
  end
end