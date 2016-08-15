require 'shell-helper'
require 'common/version'

include ShellHelper::Shell

raise "edit/replace below with specifics for this project"

{
  compile: :compileJava,
  test: 'test coverageCheck',
  open_coverage_report: :coverageReport,
  crap4j_report: :crap4jReport,
  clean: :clean,
  package: :build,
  bless_coverage: :coverageBless,
}.each{|task_name, command|
  desc "#{command} project in #{$WORKSPACE_SETTINGS[:paths][:project][:production][:home]}"
  task task_name do
    shell_command!(
      "gradle #{command}", 
      cwd: $WORKSPACE_SETTINGS[:paths][:project][:production][:home],
      environment: {
        'BRANCH_NAME' => Common::Version.application_branch,
        'COMMIT_HASH' => Common::Version.application_commit_hash,
        'APPLICATION_VERSION' => Common::Version.application_version
      }
    )
  end
}