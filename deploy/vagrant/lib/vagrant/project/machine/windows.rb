require "deep_merge"
require "vagrant/project/machine/base"
require "vagrant/project/machine/config/base"
require "vagrant/project/mixins/configurable"
require 'logging-helper'

module Vagrant
  module Project
    module Machine
      class Windows < Base
        class Configuration < Vagrant::Project::Machine::Config::Base
          include LoggingHelper::LogToTerminal

          def initialize

          end

          def configure_this(provisioner)
          end

        end

        register :windows, self.inspect

        def initialize(name, vagrant_machine, provider_class)
          super

          alias :original_configuration :configuration
          alias :configuration :wrap_configuration
        end

        def wrap_configuration
          return @configuration unless @configuration.nil?
          original_configuration

          provider.box = "windows-2008-r2-1.0.3.next"
          provider.box_url = "https://nexus.TKN-.-ecosystem_domain_name-.-TKN:8443/repositories/filerepo/com/vagrantup/basebox/windows/2008/r2/#{provider.provider_symbol.to_s}/windows-2008-r2/1.0.3.next/windows-2008-r2-1.0.3.next.box"

          vagrant_machine.vm.communicator = "winrm"
          vagrant_machine.vm.guest = :windows
          vagrant_machine.winrm.password = 'vagrant'

          if provider.provider_symbol == :virtualbox
            vagrant_machine.vm.network :forwarded_port, guest: 3389, host: 3389, id: "rdp", auto_correct: true
          end

          @configuration
        end

        def configuration_class
          Vagrant::Project::Machine::Windows::Configuration
        end

        def provisioner_class
          Vagrant::Project::Provisioner::Chef
        end

      end
    end
  end
end
