require "deep_merge"
require "vagrant/project/environment/base"

module Vagrant
  module Project
    module Environment
      module Virtualbox
        class Test < Vagrant::Project::Environment::Base
          register :'virtualbox-test', self.inspect
          
          def configure_provider(machine, &block)
            machine.provider.set_defaults{|vbox|
              #example
              #vbox.name = vagrant_machine.name
            }
            
            no_internet_cache = File.expand_path(".cache/rest/exploded", $WORKSPACE_SETTINGS[:paths][:project_paths_home])
            
            machine.provider.provider.with(no_internet_cache){|no_internet_cache|
              synced_folders{
                host_path "#{no_internet_cache}/var/yum_repo"
                guest_path '/var/yum_repo'
                create true
              }
              synced_folders{
                host_path "#{no_internet_cache}/opt/chef/embedded/lib/ruby/gems/1.9.1/cache"
                guest_path '/opt/chef/embedded/lib/ruby/gems/1.9.1/cache'
                create true
              }
              synced_folders{
                host_path "#{no_internet_cache}/var/chef/cache"
                guest_path '/var/chef/cache'
                create true
              }
            }
            block.call()
            
          end

          def configure_provisioner(machine, &block)
            machine.provisioner.set_defaults do |chef|
              chef.file_cache_path = '/var/chef/cache/artifacts'

              chef.add_recipe "vagrant::vagrant_dns"
              chef.add_recipe "yum::yum"
              chef.add_recipe "timezone-ii"
              chef.add_recipe "ntp"
              chef.add_recipe "nointernet::use_gem_cache"
              chef.add_recipe "nointernet::wrap_checksums"

              block.call()

              chef.json.deep_merge!({
                :yum => {
                  :keepcache => 1
                },
                :timezone => {
                  :use_symlink => false
                },
                :tz => 'America/New_York'
              })
            end

            machine.provisioner.machine_config.berkshelf.berksfile_path = nil
          end
        end
      end
    end
  end
end