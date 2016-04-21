#
# Cookbook Name:: workspace
# Recipe:: default
#

include_recipe "workspace::base"

case node['platform']
when 'windows'
  #maybe later
when "mac_os_x"
  include_recipe 'virtualbox'
else
  #probably not
end