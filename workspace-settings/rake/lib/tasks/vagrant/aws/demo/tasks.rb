require 'vagrant/rake/provider/aws'

provider = Vagrant::Rake::Provider::AWS.new

provider.generate_tasks

task :rt_deploy, [:version] => [:"rt_deploy_TKN-.-snake_case_project_name-.-TKN_centos_#{Git.branch_name}_demo"]
task :"rt_deploy_TKN-.-snake_case_project_name-.-TKN_centos_#{Git.branch_name}_demo", [:version] => [:download_artifact]
