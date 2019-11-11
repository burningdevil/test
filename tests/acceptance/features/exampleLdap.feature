# features/example_ldap.feature
Feature: Example For Workstation Automation for LDAP feature
  As a SET
  I would like to verify the LDAP feature for CEF Plugin

#####
# Example Test Scenario for LDAP plugin in Workstation Mac with CEF
# Author: safzal  09/04/2019
#####
  @ldap
  Scenario Outline: [TC53693] LDAP plugin feature in Workstation Mac for configured Env
    When I select tab "Environments"
    When I import LDAP users on env "<envName>"
    Then LDAP window should NOT be displayed
    When I click LDAP configure button
    Then LDAP window should be displayed
    When I select sideTab "<sideTab>"
    When I click cancel button
    Then LDAP window should NOT be displayed

    # --- The steps below only works if you are an administrator of the environment and LDAP has already been configured
    # When I add a new environment named <newEnvName> with url <envUrl>
    # When I login with <loginMode> mode using name <userName> and password <userPwd>
    # When I select project <projectName>
    # When I click OK to connect after selecting project
    # When I import LDAP users on env <newEnvName>
    # When I click OK after user import
    # Then I remove environment <newEnvName>

  Examples:
    | envName     | sideTab |
    | Plugin Test | General |
