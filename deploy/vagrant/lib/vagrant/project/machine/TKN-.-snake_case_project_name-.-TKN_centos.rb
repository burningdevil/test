require "deep_merge"
require "vagrant/project/machine/base"
require "vagrant/project/machine/config/base"
require "vagrant/project/mixins/configurable"
require 'logging-helper'
require 'uri'

module Vagrant
  module Project
    module Machine
      class TKN-.-camel_case_project_name-.-TKNCentos < Base
        class Configuration < Vagrant::Project::Machine::Config::Base
          include LoggingHelper::LogToTerminal

          def initialize
            Berkshelf::Berksfile.preposition_berksfile(File.expand_path('TKN-.-snake_case_project_name-.-TKN.berks', File.dirname(__FILE__)))
          end

          def configure_this(provisioner)
            artifact_name = $WORKSPACE_SETTINGS[:vagrant][:boxes][:centos][:name]
            artifact_version = $WORKSPACE_SETTINGS[:vagrant][:boxes][:centos][:version]
            provider.box_from_nexus(artifact_name, artifact_version)

            provider.os_name 'centos'
            provider.os_version '6.7'

            provisioner.configure{|chef|
              chef.add_recipe "TKN-.-snake_case_project_name-.-TKN"
              chef.json = {
                TKN-.-snake_case_project_name-.-TKN: {
                  
                }
              }
            }
          end

        end

        register :machine, :TKN-.-snake_case_project_name-.-TKN_centos, self.inspect

        def configuration_class
          Vagrant::Project::Machine::TKN-.-camel_case_project_name-.-TKNCentos::Configuration
        end

        def provisioner_class
          require 'vagrant/project/provisioner/chef'
          Vagrant::Project::Provisioner::Chef
        end

      end
    end
  end
end
