require 'vagrant/rake/provider/esxi'

provider = Vagrant::Rake::Provider::ESXI.new

provider.generate_tasks

task :rt_deploy, [:version] => [:"rt_deploy_TKN-.-snake_case_project_name-.-TKN_centos_#{Git.branch_name}_demo"]
task :"rt_deploy_TKN-.-snake_case_project_name-.-TKN_centos_#{Git.branch_name}_demo", [:version] => [:download_artifact]
