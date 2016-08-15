require "deep_merge"
require "vagrant/project/machine/base"
require "vagrant/project/machine/config/base"
require "vagrant/project/mixins/configurable"
require 'logging-helper'

module Vagrant
  module Project
    module Machine
      class LinuxWorkspace < Base
        class Configuration < Vagrant::Project::Machine::Config::Base
          include LoggingHelper::LogToTerminal

          def initialize
            
          end

          def configure_this(provisioner)
            if provider.box.nil? or provider.box.include?('dummy')
              artifact_name = "centos-6-7-x86_64"
              artifact_version = "1.0.14.next"
              box_name = "#{artifact_name}-#{artifact_version}"
              file_name = "#{box_name}.box"

              provider.box_url [
                $WORKSPACE_SETTINGS[:nexus][:direct_base_path],
                $WORKSPACE_SETTINGS[:nexus][:repos][:file],
                'com/vagrantup/basebox',
                artifact_name.gsub(/-/, '/'),
                provider.provider_symbol.to_s,
                artifact_name,
                artifact_version,
                file_name
              ].join('/')

              provider.box box_name

              vagrant_machine.vm.box = provider.box
              vagrant_machine.vm.box_url = provider.box_url
            end

            # provisioner.configure{|chef|

              # chef.add_recipe "play"
              # chef.json.deep_merge!({
              #   play: {
              #     home_dir: home_dir
              #   }
              # })
            # }
          end

        end

        register :linux_workspace, self.inspect

        def configuration_class
          Vagrant::Project::Machine::LinuxWorkspace::Configuration
        end

        def provisioner_class
          Vagrant::Project::Provisioner::Chef
        end

      end
    end
  end
end
