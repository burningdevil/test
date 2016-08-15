require 'vagrant/rake/provider/virtualbox'

provider = Vagrant::Rake::Provider::VirtualBox.new
provider.generate_tasks

task :"deploy_#{$WORKSPACE_SETTINGS[:project_name]}" => [:move_artifact]
