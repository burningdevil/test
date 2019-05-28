require 'vagrant/rake/provider/aws'

provider = Vagrant::Rake::Provider::AWS.new

provider.generate_tasks

task :"rt_deploy_test_react_mud_centos_#{Git.branch_name}_dev" => [:move_artifact]