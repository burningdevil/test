job 'destroyer' do
  description 'destroys pipelines that are tied to git branches that no longer exist,
branches that were deleted.'

  def name
    return @name unless @name.nil?
    @name = [
      'workstation-homescreen-admin',
      'destroyer'
    ].join(environment.delimiter)
  end

  def assigned_node
    'creator_destroyer'
  end

  properties do
    history_retention do
      set_to_default_30_days_or_120_builds
    end
  end

  scm do
    git do
      included_regions 'jenkins/.*/Smithersfile'
      repo_name 'workstation-homescreen-admin'
      organization_name 'Kiai'
      branch_name '**'
    end
  end

  triggers do
    schedule do
      set_to_every_hour
    end
  end

  build_wrappers do
    ansicolor do
    end
  end

  builders do
    bash do
      script '#!/usr/bin/env bash

set +xe

export PATH=/usr/local/sbin:/usr/local/bin:$PATH
export WORKSPACE_SETTING=fake
export ENABLE_BASELINE_WORKSPACE_CHEF=false
export CREATE_MACHINE_REPORT=false

source .ecosystem

export HATS=jenkins
rake delete_orphaned_jobs
'
    end
  end

end
