require 'example'
require 'systeminformation'

desc "trivia task"
task :trivia do
  puts "I'm calling a method from a slack gem named #{SlackGem::Example.gem_name}"
  puts "Current os type is: #{SystemInformation.os}"
  puts "Testing environment variable loading #{ENV['TEST_EXPORT']}"
end