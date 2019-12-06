require 'dependencies_db'

Rake::Task[:upload].clear_prerequisites

desc "deploy project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
task :deploy, :version do |t, args|
  good "Puts deployment code here: #{__FILE__}:#{__LINE__}"
end

desc "update the project dependencies"
task :update_dep_db_from_file do
  client = DependenciesDB.new
  # client.update_dependencies_from_file('yarn_lock')
  client.update_dependencies_table
end

desc "upload the artifact to nexus "
task :upload => [:package]

def upload_md_backup(version, sql_path)
  artifact_info = Compiler::Maven.artifact_info
  Nexus.upload_artifact(
    group_id:       "com.microstrategy.dbbackup.mysql80.#{artifact_info[:artifact_base_file_name]}",
    artifact_id:    'metadata',
    artifact_ext:   'sql',
    version:        version,
    repository:     'DBBackup',
    artifact_path:  sql_path
  )
end

desc "upload metadata backup package to Nexus: upload_md_backup[version,sql_file_path], for example: rake upload_md_backup[11.2.0001,/Users/khu/Desktop/docker/saml/metadata-0.0.2.sql]"
task :upload_md_backup, [:version, :sql_path] do |t, args|
  $WORKSPACE_SETTINGS[:nexus][:credentials][:user_name] = 'abauser'
  $WORKSPACE_SETTINGS[:nexus][:credentials][:password] = 'aba123'
  upload_md_backup(args[:version], args[:sql_path])
end
