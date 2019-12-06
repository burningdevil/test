#
# Cookbook Name:: workspace
# Recipe:: attributes_overrides
#

node.override[:nodejs].deep_merge!(
  version: '12.13.0',
  binary: {
    checksum: {
      darwin_x64: '49a7374670a111b033ce16611b20fd1aafd3296bbc662b184fe8fb26a29c22cc',
      linux_x64: 'c69671c89d0faa47b64bd5f37079e4480852857a9a9366ee86cdd8bc9670074a',
       win_x64:   '6f920cebeecb4957b4ef0def6d9b04c49d4582864f8d1a207ce8d0665865781a'
    }
  }
)