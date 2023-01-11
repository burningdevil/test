require 'nexus'
require 'fileutils'
require 'tanzu'
require 'common/version'
require 'json'
require 'git'
require "base64"
require 'date'

#code for preserve tanzu env for single node
#not moveing to eco.root, use this repo for test a while

@need_deploy_tanzu = false
@delete_tanzu = false

#count tanzu use time and skip some post process after tanzu provision
def tanzu_env_used_count(count_file_path)
  count = 0
  if File.exist?(count_file_path)
    count = File.read(count_file_path)
  end
  count += 1
  good "#{count_file_path} has been used #{count} times"
  File.open(count_file_path,"w") do |f|
    f.write(count)
  end
end

#count tanzu use time and skip some post process after tanzu provision
def reset_password_flag
  count = 0
  if File.exist?(@reset_password_count_file)
    count = File.read(@reset_password_count_file)
  end
  count += 1
  good "#{@reset_password_count_file} has been updated to #{count}"
  File.open(@reset_password_count_file,"w") do |f|
    f.write(count)
  end
end

#check service ready or not
def check_service_ready(service_name: nil, url: nil, endpoint: nil, response_code: 200)
  begin
      response = HTTParty.get(
          "#{url}/#{endpoint}"
      )
      if response.code != response_code
          raise "Service #{service_name} reponse code #{response_code}, service is not ready"
      end
      good "#{service_name} is ready on #{url}"
      return true
  rescue
      warn "#{service_name} is not ready on #{url}"
      return false
  end
end

desc "Deploy or use prepared tanzu environment on single Node"
task :deploy_or_prepared_tanzu_environment do
  """
  we only support preserve tanzu env for single node, the env info stored on the Node disk
  we may write the tanzu env into DB and provide more flexible solution to speed up tanzu provision in the future
  """
  branch = ENV["BASE_BRANCH"] || Common::Version.application_branch
  mstrBuild = ENV["Container_Build_NO"] || get_latest_container_build(branch)
  raise "invalid mstrbakUrl url" if @mstrbakUrl.nil? || @mstrbakUrl.empty?
  puts "mstrbakUrl is #{@mstrbakUrl}"
  puts "mstrBuild is #{mstrBuild}"

  #tanzu env saved under organization folder, divided by repo and branch
  tanzu_env_file_path_dir = "#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/#{$WORKSPACE_SETTINGS[:project][:name]}/#{Common::Version.application_branch}"
  tanzu_env_file_path = "#{tanzu_env_file_path_dir}/tanzu-env.json"

  FileUtils.mkdir_p("#{tanzu_env_file_path_dir}")

  #check the existing tanzu available
  if File.exist?(tanzu_env_file_path) && !@need_deploy_tanzu
    #load file
    tanzu_environment = load_tanzu_env_json(tanzu_env_file_path)
    puts "tanzu_environment is #{tanzu_environment}"
    environmentName = tanzu_environment[:environmentName] || tanzu_environment["environmentName"]
    libraryUrl = tanzu_environment[:libraryUrl] || tanzu_environment["libraryUrl"]
    existing_mstrBuild = tanzu_environment[:mstrBuild] || tanzu_environment["mstrBuild"]
    #check url if 200?
    if check_service_ready(service_name: environmentName, url: libraryUrl, endpoint: 'api/status', response_code: 200)
      @need_deploy_tanzu = false
      puts "#{libraryUrl} is still avaliable, will reuse it"
    else
      #environment is not avalible anymore
      @need_deploy_tanzu = true
    end

    #if input build NO, check the build number same or not to decide if need deploy new tanzu
    #will delete after deploy for input diffrent build number
    if ENV["Container_Build_NO"] && ENV["Container_Build_NO"] != existing_mstrBuild
      warn "need deploy because you input a different container build #{ENV["Container_Build_NO"]}"
      @need_deploy_tanzu = true
      #only once, delete after use
      @delete_tanzu = true
      #do not overwrite tanzu under organization
      tanzu_env_file_path = @tanzu_env
    end
  else
    @need_deploy_tanzu = true
  end

  #deploy if in need
  if @need_deploy_tanzu
    puts "tanzu_env_file_path is #{tanzu_env_file_path}"
    do_prepare_tanzu_environment(@mstrbakUrl, mstrBuild, tanzu_env_file_path)
  end

  #copy to workspace for following tasks to read from there
  FileUtils.cp_rf(tanzu_env_file_path, @tanzu_env)
end

desc "Delete preserved tanzu environment"
task :delete_preserved_tanzu_environment do
  begin
    #tanzu env saved under organization folder, divided by repo and branch
    tanzu_env_file_path_dir = "#{$WORKSPACE_SETTINGS[:paths][:organization][:home]}/#{$WORKSPACE_SETTINGS[:project][:name]}/#{Common::Version.application_branch}"
    tanzu_env_file_path = "#{tanzu_env_file_path_dir}/tanzu-env.json"
    tanzu_environment = load_tanzu_env_json(tanzu_env_file_path) if File.exist?(tanzu_env_file_path)
    environmentName = tanzu_environment[:environmentName] || tanzu_environment["environmentName"]
    do_delete_tanzu_environment(environmentName)
  rescue
    puts "skip delete tanzu"
  end
end

