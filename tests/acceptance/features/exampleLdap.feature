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
    Then I disconnect environment
    When I configure LDAP service on env <envName>
    Then LDAP window should be displayed
    Then I close pop up window for <window> window
    And LDAP window should NOT be displayed
    Then I connect existing environment <envName>
    # When I configure LDAP service on env <envName>
    # Then LDAP window should be displayed
    # Then I select sideTab <sideTab>
    # Then I click cancel button
    # And LDAP window should NOT be displayed

  Examples:
    | tabName      | envName | sideTab | window                      |
    | Environments | LDAP    | General | Configure Directory Service |


  # @ldap
  # Scenario Outline: LDAP plugin feature in Workstation Mac for error scenario
  #   When I select tab <tabName>
  #   When I configure LDAP service on env <envName>
  #   Then LDAP window should be displayed
  #   Then I close pop up window for <window> window
  #   And LDAP window should NOT be displayed

  # Examples:
  #   | tabName      | envName  | window                      |
  #   | Environments | AQ 11    | Configure Directory Service |
