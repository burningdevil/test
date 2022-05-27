#
# Cookbook Name:: workspace
# Attributes:: default
#
default[:workspace][:nodejs][:package] = value_for_platform_family(
  ['rhel', 'fedora'] => 'nodejs',
  'mac_os_x' => 'node',
  'default' => 'nodejs'
)

default[:workspace][:nodejs][:packages] = {
  'yarn' => '1.12.3',
  'appium' => '1.22.0'
}

default[:workspace][:nexus_url] = 'https://nexus.internal.microstrategy.com:8443/repositories'