require "deep_merge"
require "vagrant/project/environment/base"

module Vagrant
  module Project
    module Environment
      module Virtualbox
        class Default < Vagrant::Project::Environment::Base
          register :virtualbox, self.inspect
          
          def configure_provider(machine, &block)
            if machine.provider.configuration.box.nil? or machine.provider.configuration.box.include?('dummy')
              artifact_name = "centos-6-7-x86_64"
              artifact_version = "1.0.14.next"
              file_name = "#{artifact_name}-#{artifact_version}.box"

              machine.provider.configuration.box_url [
                $WORKSPACE_SETTINGS[:nexus][:direct_base_path],
                $WORKSPACE_SETTINGS[:nexus][:repos][:file],
                'com/vagrantup/basebox',
                artifact_name.gsub(/-/, '/'),
                machine.provider.provider_symbol.to_s,
                artifact_name,
                artifact_version,
                file_name
              ].join('/')

              machine.provider.configuration.box file_name
            end

            machine.provider.set_defaults{|vbox|
              #example
              #vbox.name = vagrant_machine.name
            }

            file_cache = "#{$WORKSPACE_SETTINGS[:paths][:project][:deploy][:vagrant][:home]}/#{$WORKSPACE_SETTINGS[:vagrant][:default][:provider]}/.filecache"

            machine.provider.configuration.with(file_cache){|file_cache|
              case machine.vagrant_machine.vm.guest
              when :windows
                
              else
                synced_folders{
                  host_path  "#{file_cache}/yum_cache"
                  guest_path '/var/cache/yum'
                  create true
                }
                synced_folders{
                  host_path  "#{file_cache}/yum_repo"
                  guest_path '/var/yum_repo'
                  create true
                }
                synced_folders{
                  host_path  "#{file_cache}/chef_gems"
                  guest_path '/opt/chef/embedded/lib/ruby/gems/2.1.0/cache'
                  create true
                }
              end

              synced_folders{
                host_path  "#{file_cache}/chef"
                guest_path '/var/chef/cache/artifacts'
                create true
              }
            }
            
            block.call()
            
          end

          def configure_provisioner(machine, &block)
            Berkshelf::Berksfile.preposition_berksfile(File.expand_path('virtualbox_default.berks', File.dirname(__FILE__)))

            machine.provisioner.set_defaults do |chef|
              chef.file_cache_path = '/var/chef/cache/artifacts'

              chef.add_recipe "chef_commons"
            end
            
            case machine.vagrant_machine.vm.guest
            when :windows

            else
              machine.provisioner.configure do |chef|
                # chef.add_recipe "dev_commons::hosts"
                # chef.add_recipe "virtualbox::google_dns"
                # chef.add_recipe "yum_mirror::repo"
                # chef.add_recipe "yum"
                # chef.add_recipe "timezone-ii"
                # chef.add_recipe "ntp"
              end
            end

            machine.provisioner.configure do |chef|
              block.call()
            end

            machine.provisioner.configure do |chef|
              if ARGV.include?('machines')
              chef.json.deep_merge!({
                  ec2: {
                    mock: {
                      in_ec2?: false
                    }
                  }
                })
              end
              
              chef.json.deep_merge!({
                data_bag_secret: 'Z91%gDUDF5!jz0UE3ZC$9VR!o892',
                yum: {
                  main: {
                    keepcache: true
                  }
                },
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