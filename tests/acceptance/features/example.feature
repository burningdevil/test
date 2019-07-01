# features/example.feature
Feature: Example For Workstation Automation
  As a SET
  I would like to verify the Test Infrastructure (Appium + Protractor) 
  For Workstation Windows and Workstation Mac with CEF

#####   
# Example Test Scenario for Quick Search in Workstation Mac with CEF
# Author: qfan  06/11/2019
##### 
  @mac_example
  Scenario Outline: [TC42657] Quick Search Dossier in Workstation Mac with CEF
    # When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
    # And I login with LDAP mode using name yourname and password yourpwd
    # Then I select project Rally Analytics
    # And I click OK to connect after selecting project(s)
    # When I first-time select tab Dossiers and wait for cache generation
    When I search for <itemName>
    Then Result Popup should be displayed with <count> items
    When I click on item <itemName>
    Then Dossier <itemName> should be displayed
    Then I close Dossier <itemName>
    And I clear search
    # Then I select tab Environments
    # And I remove environment AQDT

    Examples:
      | itemName  | count |
      | TEC.PD    | 3     |
      | TEC.AT    | 4     |

#####   
# Example Test Scenario for New Dossier in Workstation Windows
# Author: qfan  06/11/2019
##### 
  @mac_example @windows_example
  Scenario: Windows Workstation 
    # When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
    # And I login with LDAP mode using name yourname and password yourpwd
    # Then I select project Rally Analytics
    # And I click OK to connect after selecting project(s)
    When I select tab Dossiers
    And I create a new item Dossier
    Then Dossier Untitled Dossier should be displayed
    Then I close Dossier Untitled Dossier
    # Then I select tab Environments
    # And I remove environment AQDT

  # @ub
  # Scenario Outline: [TC42657] Quick Search Dossier in Workstation Mac with CEF
  #   # When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
  #   # And I login with LDAP mode using name yourname and password yourpwd
  #   # Then I select project Rally Analytics
  #   # And I click OK to connect after selecting project(s)
  #   # When I first-time select tab Dossiers and wait for cache generation
  #   When I search for <itemName>
  #   # Then Result Popup should be displayed with <count> items
  #   # When I click on item <itemName>
  #   # Then Dossier <itemName> should be displayed
  #   # Then I close Dossier <itemName>
  #   And I clear search

  # Examples:
  # | itemName  | count |
  # | TEC.PD    | 3     |
  # | TEC.AT    | 4     |

  @ub
  Scenario: Search and open luntan3
    # When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
    # And I login with LDAP mode using name yourname and password yourpwd
    # Then I select project Rally Analytics
    # And I click OK to connect after selecting project(s)
    # When I first-time select tab Dossiers and wait for cache generation
    # When I first-time select tab Dossiers and wait for cache generation
    And I search for luntanub

    # Then Result Popup should be displayed with 3 items
    # When I click on item LUNTANUB4
    # Then Dossier LUNTANUB4 should be displayed
    # When I close Dossier LUNTANUB4
    And I clear search

  # @ub
  # Scenario: Search and open luntan4
  #   # When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
  #   # And I login with LDAP mode using name yourname and password yourpwd
  #   # Then I select project Rally Analytics
  #   # And I click OK to connect after selecting project(s)
  #   # When I first-time select tab Dossiers and wait for cache generation
  #   # When I first-time select tab Dossiers and wait for cache generation
  #   And I search for luntanub

  #   Then Result Popup should be displayed with 3 items
  #   When I click on item LUNTANUB5
  #   Then Dossier LUNTANUB5 should be displayed
  #   When I close Dossier LUNTANUB5
  #   And I clear search