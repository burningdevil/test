require "deep_merge"
require "vagrant/project/machine/base"
require "vagrant/project/machine/config/base"
require "vagrant/project/mixins/configurable"
require 'logging-helper'

module Vagrant
  module Project
    module Machine
      class TestMud3 < Base
        class Configuration < Vagrant::Project::Machine::Config::Base
          include LoggingHelper::LogToTerminal

          def initialize
            
          end

          def configure_this(provisioner)
            provisioner.configure{|chef|

              chef.add_recipe "TKN-.-snake_case_project_name-.-TKN"
              chef.json = {
                
              }
            }
          end

        end

        register :TKN-.-snake_case_project_name-.-TKN, self.inspect

        def configuration_class
          Vagrant::Project::Machine::TestMud3::Configuration
        end

        def provisioner_class
          Vagrant::Project::Provisioner::Chef
        end

      end
    end
  end
end
