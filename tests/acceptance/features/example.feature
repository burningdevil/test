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
    When I search for <itemName>
    Then Result Popup should be displayed with <count> items
    When I click on item <itemName>
    Then Dossier <itemName> should be displayed
    Then I close Dossier <itemName>
    And I clear search

    Examples:
      | itemName  | count |
      | TEC.PD    | 3     |
      | TEC.AT    | 4     |

#####   
# Example Test Scenario for New Dossier in Workstation Windows
# Author: qfan  06/30/2019
##### 
  @windows_example @debug
  Scenario Outline: Windows Workstation - Hyper
    When I select tab Cards
    When I open card <cardName>
    When I clear card
    And I close card <cardName>

        Examples:
      | cardName  |
      | 550blitz  |
      | Accounts  |


  @ub
  Scenario: ub search for test1
    When I search for test1
    And I clear search

  @ub
  Scenario: ub search for test2
    When I search for test2
    And I clear search

  @ub
  Scenario: ub search for test3
    When I search for test3
    And I clear search