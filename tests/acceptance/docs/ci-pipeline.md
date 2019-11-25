# Test in CI Pipeline

## Test Environment Information
For any Plugin Application repository created from the template repository, the file /deploy/helm/dev/values.yaml should have stored all the information for Metadata, Warehouse, Intelligence Server, and Library Server.

All the versions need to be manually updated.

## Metadata & Warehouse
For any Plugin Application repository created from the template repository, the file /deploy/helm/dev/values.yaml has stored the information for Metadata, Warehouse, Intelligence Server, and Library Server. It originally set the MD & WH to the clean MD / WH databases that have been certified can be successfully configured and deployed in CI Pipeline. It is suggested we build our our test objects upon this clean version of MD & WH.

Clean MD & WH can be downloaded from [Nexus](http://nexus.internal.microstrategy.com:8081/#browse/browse:DBBackup:com%2Fmicrostrategy%2Fdbbackup%2Fmysql80%2Fworkstation-plugin)

With the clean MD & WH, you can start to deploy your own MicroStrategy environment, and create any test objects you needed.

After a local certification of the customized Metadata & Warehouse is done, please
- export your Metadata & Warehouse Databases
- Upload the new version of Databases to Nexus
- Update the Metadata & Warehouse link in the values.yaml file
You can follow this [documentation](https://microstrategy.atlassian.net/wiki/spaces/TTWF/pages/818909191/Test+Environment) to perform these actions

Note: If your Metadata involves cubes, please contact DevOps team as this need some extra manual work.

## Cucumber Tags & CI Pipeline Stages
In CI Pipeline it assumes that each team is using the same tags for scenarios to be run in different stages.
- Premerge Stage: All scenarios tagged with '@ACCEPTANCE' will be run
- Dev Stage: All scenarios tagged with '@ACCEPTANCE' will be run
- Postmerge Stage: All scenarios will be run excpet those tagged with 'wip' or 'slow'

If there is no required tags found in your test script, then no scenario will be run and it will always pass the test.

## Test in Windows & Mac
Please notice that you should always make sure your test script can pass both in Windows Workstation and Mac Workstation (even when only Window/Mac implemented). The CI Pipeline will only recognize a successful build when test pass in both Mac & Window Workstation.







