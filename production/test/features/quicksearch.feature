# features/test.feature
Feature: QuickSearch in Workstation
  As a SET
  I would like to check the search with CEF in Workstation
  To prove the capability of this Test Infrastructure

  # Connect to environment
  Scenario: [TC42657] Quick Search in Workstation
    When I add a new environment named AQDT with url https://aqueduct-tech.customer.cloud.microstrategy.com/MicroStrategyLibrary
    And I login with LDAP mode using name yourname and password yourpwd
    Then I select project Rally Analytics
    When I select tab Dossiers
    And I search for TEC.UB
    Then Result Popup should be displayed with 3 items
    When I click on item TEC.UB
    Then Dossier TEC.UB should be displayed
    Then I close Dossier TEC.UB
    Then I select tab Environments
    And I remove environment AQDT

