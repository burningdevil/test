# features/example_ldap.feature
Feature: Example For Workstation Automation for LDAP feature
  As a SET
  I would like to verify the LDAP feature for CEF Plugin

#####
# Example Test Scenario for LDAP plugin in Workstation Mac with CEF
# Author: safzal  09/04/2019
#####
  @ldap
  Scenario Outline: LDAP plugin feature in Workstation Mac for configured Env
    When I select tab <tabName>
    When I configure LDAP service on env <envName>
    Then LDAP window should be displayed
    Then I select sideTab <sideTab>
    Then I click cancel button
    And LDAP window should NOT be displayed
    When I import LDAP users on env <envName>
    Then I click OK after user import

    When I add a new environment named <newEnvName> with url <envUrl>
    When I login with <loginMode> mode using name <userName> and password <userPwd>
    When I select project <projectName>
    When I click OK to connect after selecting project
    When I import LDAP users on env <newEnvName>
    Then LDAP window should NOT be displayed
    When I click LDAP configure button
    Then LDAP window should be displayed
    Then I select sideTab <sideTab>
    Then I click cancel button
    And LDAP window should NOT be displayed
    When I remove environment <newEnvName>

  Examples:
    | tabName      | envName    | sideTab | window                      | newEnvName    | envUrl                                                               | loginMode | userName      | userPwd | projectName            |
    | Environments | LDAP Patch | General | Configure Directory Service | LDAP Unconfig | http://tec-w-005136.labs.microstrategy.com:8080/MicroStrategyLibrary | Standard  | administrator | blank   | MicroStrategy Tutorial |