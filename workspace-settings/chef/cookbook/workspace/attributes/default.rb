#
# Cookbook Name:: workspace
# Attributes:: default
#

default[:workspace][:user] = ENV['USER']
default[:workspace][:lxc_host] = false
default[:workspace][:slave_recipes] = []
