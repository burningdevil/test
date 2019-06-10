# features/example.feature
Feature: Workstation Automation
  As a SET
  I would like to verify the Test Infrastructure (Appium + Protractor) 
  For Workstation Windows and Workstation Mac with CEF

  @mac_example @e2e
  Scenario Outline: [TC42657] Quick Search Dossier in Workstation Mac with CEF
    When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
    And I login with LDAP mode using name yourname and password yourpwd
    Then I select project Rally Analytics
    When I first-time select tab Dossiers and wait for cache generation
    And I search for <itemName>
    Then Result Popup should be displayed with <count> items
    When I click on item <itemName>
    Then Dossier <itemName> should be displayed
    Then I close Dossier <itemName>
    Then I select tab Environments
    And I remove environment AQDT

    Examples:
      | itemName  | count |
      | TEC.UB    | 3     |
      | TEC.AT    | 4     |

  @windows_example
  Scenario: Windows Workstation 
    When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
    And I login with LDAP mode using name yourname and password yourpwd
    Then I select project Rally Analytics
    When I select tab Dossiers
    And I create a new item Dossier
    Then Dossier Untitled Dossier should be displayed
    Then I close Dossier Untitled Dossier
    Then I select tab Environments
    And I remove environment AQDT