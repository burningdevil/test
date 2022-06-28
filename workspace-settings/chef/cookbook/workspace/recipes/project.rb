#
# Cookbook Name:: workspace
# Recipe:: project
#

include_recipe 'chef_commons'
include_recipe 'workspace::attributes_overrides'

include_recipe 'helm'
include_recipe 'kube-config'
include_recipe 'nodejs'

npm_package_directory = '~/.npm-global'
case node['platform']
when 'mac_os_x'
  # change npm’s default directory to reduce the permission deny issue when install npm packages
  bash 'config_npm_directory' do
  code <<-EOH
    mkdir  #{npm_package_directory}
    sudo chown -R $USER:$(id -gn $USER) /var/lib/jenkins/.config
    npm config set prefix '#{npm_package_directory}'
  EOH
  not_if { ::File.exist?(npm_package_directory) }
  user ENV['USER']
  end

  ark "AppiumForMac" do
    puts "This OS #{ node['platform']} does not require to install AppiumForMac!"
    url 'https://github.com/appium/appium-for-mac/releases/download/v0.3.0/AppiumForMac.zip'
    path '/Applications/'
    checksum '3bf67a5d99f79b928f936284d9b8ee26a74b8924'
    action :put
    owner ENV['USER']
  end

  execute "remove com.apple.quarantine" do
    command "xattr -r -d com.apple.quarantine /Applications/AppiumForMac.app/"
    only_if "xattr /Applications/AppiumForMac.app/ | grep 'com.apple.quarantine'"
    user ENV['USER']
  end

  node[:workspace][:nodejs][:packages].each do |key, value|
    execute 'install_yarn_packages' do
      command "npm install -g #{key}@#{value}"
      not_if "which #{key}"
      user ENV['USER']
    end
  end

when 'windows'
  if node['platform_version'].to_i >= 10

    registry_key 'enable developer mode for windows' do
      key 'HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock'
      values [
        {name: "AllowDevelopmentWithoutDevLicense", type: :dword, data: 1 }
      ]
      action :create
    end

    #nodejs_npm 'yarn' do
    #  version '1.12.3'
    #end
    
    puts ENV['NODE_HOME']
    execute 'install_yarn' do
      cwd ENV['NODE_HOME']
      command "corepack enable"  #for Node.js >=16.10
      not_if { ::File.exist?("#{ENV['NODE_HOME']}/yarn") }
    end

    directory "C:\\ffmpeg" do
      recursive true
      action :delete
    end

    remote_file "C:\\ffmpeg.zip" do
      source "https://nexus.internal.microstrategy.com/repository/filerepo/org/ffmpeg/windows/ffmpeg-win64/20200330/ffmpeg-win64-20200330.zip"
      not_if { ::File.exist?("C:\\ffmpeg.zip") }
    end

    execute 'unzip ffmpeg' do
      command <<-EOH
          "C:\\Program Files\\7-Zip\\7z.exe" x C:\\ffmpeg.zip -oC:\\ -r -y
      EOH
      only_if { ::File.exist?("C:\\ffmpeg.zip") }
    end
    
  end
else
  puts "To configure the npm default directory on this OS is not tested! Skip this step!"
end


# include_recipe 'docker'

