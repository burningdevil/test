require 'shell-helper'
require 'common/version'
require 'docker-registry'

include ShellHelper::Shell

def docker_image_name
  DockerRegistry.image_from_nexus("node:#{ENV['nodejs_image_tag']}")
end

desc "build project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :build do
  node_modules_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/node_modules"
  app_locale_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/src/locale"
  menu_locale_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/src/assets/i18n"

  FileUtils.rm_rf(node_modules_folder) if File.exist?(node_modules_folder)
  FileUtils.mkdir_p(app_locale_folder) unless File.exist?(app_locale_folder)
  FileUtils.mkdir_p(menu_locale_folder) unless File.exist?(menu_locale_folder)
  app_database_name = $WORKSPACE_SETTINGS[:project][:name].upcase.gsub('-', '_')
  shell_command!(
    "docker run -v #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}:/mnt/production -e APP_DATABASE_NAME=#{app_database_name} --entrypoint '/bin/sh' maven:alpine /mnt/production/i18n.sh",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
  
  shell_command!(
    "docker run -v #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}:/mnt/production -e APPLICATION_VERSION=#{Common::Version.application_version} --entrypoint '/bin/sh' #{docker_image_name} /mnt/production/build.sh",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
#   shell_command!(
#     "npm run metrics",
#     cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
#   )
end

desc "package project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :package => [:build] do
  build_folder = Compiler::Maven.artifact_info[:output_dir]
  FileUtils.rm_rf(build_folder) if File.exist?(build_folder)
  FileUtils.mkdir_p(build_folder) unless File.exist?(build_folder)
  shell_command!(
    "zip -r #{build_folder}/#{$WORKSPACE_SETTINGS[:project][:name]}-#{Common::Version.application_version}.zip dist",
    cwd: "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  )
end

desc "run premerge"
task :premerge do 
  node_modules_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/node_modules"
  tests_node_modules_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:tests][:acceptance][:home]}/node_modules"
  
  FileUtils.rm_rf(node_modules_folder) if File.exist?(node_modules_folder)
  FileUtils.rm_rf(tests_node_modules_folder) if File.exist?(tests_node_modules_folder)

  shell_command!(
    "docker run -v #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}:/mnt/production -e APPLICATION_VERSION=#{Common::Version.application_version} --entrypoint '/bin/sh' #{docker_image_name} /mnt/production/premerge.sh",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )

  shell_command!(
    "docker run -v #{$WORKSPACE_SETTINGS[:paths][:project][:tests][:acceptance][:home]}:/mnt/tests/acceptance --entrypoint '/bin/sh' #{docker_image_name} /mnt/tests/acceptance/premerge.sh",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
end

desc "Upload premerge binaries for testing"
task :upload_pre_binaries => [:package] do
  artifact_info = Compiler::Maven.artifact_info
  Nexus.upload_artifact(
    group_id:       "#{$WORKSPACE_SETTINGS[:nexus][:base_coordinates][:group_id]}.#{ENV['ghprbSourceBranch']}",
    artifact_id:    artifact_info[:artifact_base_file_name],
    artifact_ext:   artifact_info[:artifact_file_extension],
    version:        artifact_info[:artifact_version],
    repository:     $WORKSPACE_SETTINGS[:nexus][:repos][:release],
    artifact_path:  artifact_info[:artifact_file_path]
  )
end

def generate_sonar_inclusions
  pull_request_id = ENV['ghprbPullId']
  org,repo = ENV['ghprbGhRepository'].split('/')

  pull_requests = Github::PullRequests.new(Github.credentials[:username], Github.credentials[:password])
  changed_files = pull_requests.get_changed_files(repo, org, pull_request_id)
  targets = []
  changed_files.each do |changed_file|
    targets.append(changed_file['filename'])
  end

  sonar_inclusions = targets.join(',')
  sonar_properties_file = "sonar-project.properties"
  good "sonarqube scanner inclusions: #{sonar_inclusions}"

  File.delete(sonar_properties_file) if File.exist?(sonar_properties_file)
  unless targets.empty?
    File.open(sonar_properties_file, "w") {|file|
      file.write("sonar.inclusions=#{sonar_inclusions}")
    }
  end
end

desc "generate sonarqube incluesion for PR changed files"
task :generate_sonar_inclusions do
  generate_sonar_inclusions
end

def run_unit_test
  node_modules_folder = "#{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}/node_modules"

  FileUtils.rm_rf(node_modules_folder) if File.exist?(node_modules_folder)

  shell_command!(
    "yarn install",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
  shell_command!(
    "npm run compile",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
  shell_command!(
    "npm run unit-test",
    cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home]
  )
end
desc "run unit test premerge"
task :run_unit_test do
  run_unit_test
end