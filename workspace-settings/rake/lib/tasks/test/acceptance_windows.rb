require_relative 'acceptance_mac'
require 'nexus'
require 'fileutils'
require 'pry'
require 'json'
require 'github'
require 'nokogiri'
require 'common/version'

@artifact_info = Compiler::Maven.artifact_info
@wkstn_branch  = ENV['ghprbTargetBranch'] || Common::Version.application_branch
@workstaion_install_path="#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/.workstation/#{get_application_prefix}"
@workstation_zip_path = "#{@workstaion_install_path}/workstation-windows.zip"
@config_file = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/protractorArgs.json"
@mstrbakUrl = "s3://mci-dev-mstrbak/workstation-home-admin-ci-mstrbak.tar.gz"
@tanzu_env = "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance/tanzu-env.json"

task :install_workstation_windows do
  install_workstation_windows
end

task :replace_plugin_windows do
  replace_plugin_windows
  plugin = { 'name' => plugin_name_mapping || @artifact_info[:artifact_base_file_name] }
  plugin_path = "C:/Program Files/MicroStrategy/Workstation/Plugins/#{plugin['name']}"
  enable_feature_flag(plugin_path)
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

task :do_test_when_test_file_changed do |t,args|
  info "====== Run UI automation tests ======"
  Rake::Task['install_workstation_windows'].invoke
  Rake::Task['prepare_tanzu_environment'].invoke
  Rake::Task['sanity_test_win'].invoke
  # info "====== try to find if there is changed files in test document ======"
  # git_user = ENV['GITHUB_SVC_USER']
  # git_pswd = ENV['GITHUB_SVC_PWD']
  # pr_id = ENV['ghprbPullId']
  # pull_instance = Github::PullRequests.new(git_user, git_pswd)
  # changed_files = pull_instance.get_changed_files('workstation-homescreen-admin', 'Kiai', pr_id)
  # if_changed_files_in_document = false
  # if changed_files then
  #   for changed_file in changed_files do
  #     if changed_file['filename'].start_with?('tests/acceptance/features') then
  #       if_changed_files_in_document = true
  #       Rake::Task['eks_deploy'].invoke
  #       Rake::Task['install_workstation_windows'].invoke
  #       Rake::Task['sanity_test_win'].invoke
  #     end
  #   end
  # end
  # if if_changed_files_in_document then
  #   info "====== no changed file in test document ======"
  # end
end

def update_db_and_user(product)
  # update db
  puts "override update_db_and_user"
  appdata_location = "#{ENV['LOCALAPPDATA']}\\MicroStrategy_Inc".gsub("\\",'/')
  FileUtils.mkdir_p(appdata_location)

  info "====== AppData localtion: #{appdata_location} ======"
  # update user
  Dir.glob("#{appdata_location}/**/user.config").each do |user_config|
    info "find user config at #{user_config}"
    unless user_config.include?(product['version'].split('.').last)
      info "updating user config at #{user_config}"
      FileUtils.cp_r("#{$WORKSPACE_SETTINGS[:paths][:project][:workspace][:settings][:rake][:lib][:templates][:home]}/user.config", user_config, remove_destination: true)
    end
    # update configs
    data = File.read(user_config)
    doc = Nokogiri::XML.parse data
    root_node = doc.at('//configuration').at('//userSettings').at('//Workstation.Properties.Settings')
    setting_node = Nokogiri::XML::Node.new("setting",doc)
    setting_node['name'] = 'Preferences'
    setting_node['serializeAs'] = 'String'
    value_node = Nokogiri::XML::Node.new("value",doc)
    value_node.content = '{"preview-features":true,"show-hidden-objects":false,"use-contentbundle":true,"use-cubeeditor":false,"use-objectmigration":false,"use-microchart":true,"use-richtextbox":true,"support-info-window":true}'
    setting_node << value_node

    # remove setting with name 'Preferences'
    for temp_node in root_node.search('setting') do
      if temp_node.keys.include?('name') && temp_node['name'] == 'Preferences' then
        info "remove origin Preferences"
        temp_node.remove()
      end
    end

    info "add new Preferences"
    root_node << setting_node
    File.open(user_config, 'w') do |file|
      file.print doc.to_xml
    end
  end
end

def enable_feature_flag(plugin_path)
  config_file = "#{plugin_path}/workstation.json"
  data_hash = JSON.parse(File.read(config_file))
  data_hash['isEnabled'] = true
  File.write(config_file, JSON.pretty_generate(data_hash))
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
  #shell_command! "powershell -command 'Set-DisplayResolution -Width 1920 -Height 1080 -Force'"
  #shell_command! "powershell -command 'Get-DisplayResolution'"

  
  info "====== starting test ======"
  environmentName = ""
  begin
    libraryUrl, environmentName = prepare_for_workstation_test(@tanzu_env, @config_file, keywords=nil,replace_json=true)
    if libraryUrl.nil? || libraryUrl.empty?
      raise "invalid library url #{libraryUrl}"
    end

    info "====== yarn install starting ======"
    shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! 'npm config set script-shell "C:/usr/bin/bash"', environment: {'MSYS' => 'winsymlinks:nativestrict'}

    shell_command! "node trigger_test.js  \"#{workstation_path}\"  \"#{libraryUrl}/\" \"@Regression\" 54213 \"#{Common::Version.application_version}\"", cwd: "I:/tests/acceptance"
    info "update rally test results"
    shell_command! "node rally/updateE2EResultsToClientAutoData.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "I:/tests/acceptance"
    shell_command! "node rally/updateE2EResultsToRally.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "I:/tests/acceptance"
    do_delete_tanzu_environment(environmentName)
    post_process_workstation_ci(result:"pass", update_nexus:true, update_rally:false, coverage_report:false, platform:'win', platform_os:nil)
  rescue => e
    info "update rally test results"
    shell_command! "node rally/updateE2EResultsToClientAutoData.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "I:/tests/acceptance"
    shell_command! "node rally/updateE2EResultsToRally.js -c \"#{Common::Version.application_version}\" \"#{ENV['BUILD_URL']}\"", cwd: "I:/tests/acceptance"
    error "exception from test:\n #{e}"
    do_delete_tanzu_environment(environmentName)
    post_process_workstation_ci(result:"fail", update_nexus:true, update_rally:false, coverage_report:false, platform:'win', platform_os:nil)
  end
end

task :sanity_test_win do |t,args|
  #stop_winappdriver
  #uninstall_winappdriver
  map_I
  workstation_path = "C:\\Program Files\\MicroStrategy\\Workstation\\Workstation.exe"
  close_apps

  shell_command! "powershell -command 'Get-DisplayResolution'"
  #shell_command! "powershell -command 'Set-DisplayResolution -Width 1920 -Height 1080 -Force'"
  #shell_command! "powershell -command 'Get-DisplayResolution'"

  
  info "====== starting test ======"
  environmentName = ""
  begin
    libraryUrl, environmentName = prepare_for_workstation_test(@tanzu_env, @config_file, keywords=nil,replace_json=true)
    if libraryUrl.nil? || libraryUrl.empty?
      raise "invalid library url #{libraryUrl}"
    end

    info "====== yarn install starting ======"
    shell_command! "npm install", cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:home]}/tests/acceptance"
    shell_command! 'npm config set script-shell "C:/usr/bin/bash"', environment: {'MSYS' => 'winsymlinks:nativestrict'}

    shell_command! "node trigger_test.js  \"#{workstation_path}\"  \"#{libraryUrl}/\" \"@Sanity\" 54213 \"#{ENV['ghprbSourceBranch']}\"", cwd: "I:/tests/acceptance"
    do_delete_tanzu_environment(environmentName)
    post_process_workstation_ci(result:"pass", update_nexus:true, update_rally:false, coverage_report:false, platform:'win', platform_os:nil)
  rescue => e
    error "exception from test:\n #{e}"
    do_delete_tanzu_environment(environmentName)
    post_process_workstation_ci(result:"fail", update_nexus:true, update_rally:false, coverage_report:false, platform:'win', platform_os:nil)
  end
end
