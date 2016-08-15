require "deep_merge"
require "vagrant/project/machine/base"
require "vagrant/project/machine/config/base"
require "vagrant/project/mixins/configurable"
require 'logging-helper'

module Vagrant
  module Project
    module Machine
      class OSXWorkspace < Base
        class Configuration < Vagrant::Project::Machine::Config::Base
          include LoggingHelper::LogToTerminal

          def initialize

          end

          def configure_this(provisioner)
          end

        end

        register :osx_workspace, self.inspect

        def configuration_class
          Vagrant::Project::Machine::OSXWorkspace::Configuration
        end

        def provisioner_class
          Vagrant::Project::Provisioner::Chef
        end

      end
    end
  end
end
