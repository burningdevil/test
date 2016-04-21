require "deep_merge"
require "vagrant/project/environment/base"

module Vagrant
  module Project
    module Environment
      module ESXI
        class Default < Vagrant::Project::Environment::Base
          register :esxi, self.inspect

          def configure_provider(machine, &block)
            if machine.provider.box.nil? or machine.provider.box.include?('dummy')
              machine.provider.box_url = 'https://nexus.TKN-.-ecosystem_domain_name-.-TKN:8443/repositories/filerepo/com/vagrantup/basebox/centos/6/7/x86_64/esxi/centos-6-7-x86_64/1.0.6.next/centos-6-7-x86_64-1.0.6.next.box'
              machine.provider.box = File.basename(machine.provider.box_url, '.*')
            end

            machine.provider.set_defaults{|vbox|
              #example
              #vbox.name = vagrant_machine.name
            }

            machine.provider.configuration.with{
              host          "10.242.102.40"
              datastore     "datastore1"
              user          "root"
              password      "zbavrf&ebhtr!ergnva"
              ssh_key_path  "#{$WORKSPACE_SETTINGS[:paths][:project_paths_workspace]}/temp/.ssh/esxi.key"
            }
            block.call()
          end

          def configure_provisioner(machine, &block)
            Berkshelf::Berksfile.preposition_berksfile(File.expand_path('esxi_default.berks', File.dirname(__FILE__)))

            machine.provisioner.set_defaults do |chef|
              chef.file_cache_path = '/var/chef/cache/artifacts'

              chef.add_recipe "chef_commons"
              chef.add_recipe "yum_mirror::repo"
              chef.add_recipe "timezone-ii"
              chef.add_recipe "ntp"

              block.call()

              chef.json.deep_merge!({
                data_bag_secret: 'change_me',
                yum_mirror: {
                  mirrors: [
                    {
                      name: 'microstrategy-rhel-6-extra',
                      url:  'https://yum.TKN-.-ecosystem_domain_name-.-TKN/extra'
                    }
                  ],
                  favor: true
                },
                timezone: {
                  use_symlink: false
                },
                tz: 'America/New_York'
              })
            end
          end
        end
      end
    end
  end
end