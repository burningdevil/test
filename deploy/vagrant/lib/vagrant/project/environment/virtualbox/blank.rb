require "deep_merge"
require "vagrant/project/environment/base"

module Vagrant
  module Project
    module Environment
      module Virtualbox
        class Blank < Vagrant::Project::Environment::Base
          register :environment, :blank_virtualbox, self.inspect
          
          def configure_provider(machine, &block)
            machine.provider.set_defaults{|vbox|
              #example
              #vbox.name = vagrant_machine.name
            }
            
            block.call()
            
          end

          def configure_provisioner(machine, &block)
            
          end
        end
      end
    end
  end
end