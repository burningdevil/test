Feature: CEF support for settings
  Workstation should use CEF as the webview to support the plugins. This feature covers the support for the Settings plugin. 
  Settings has two tabs that we need to test: 
  1. Governing Settings: right click on the environment and select "get info", then select governing settings.
  2. All Settings: right click on the environment and select "get info", then select all settings.

  This feature only works for Mac as an example.

#####
# Example Test Scenario for the Settings plugin in Workstation Mac with CEF
# Author: Lun  10/07/2019
#####
  @settings
  Scenario: [TC53694] Open the Governing Settings plugin
    When I select tab Environments
    And I select view listView
    And I select context menu option Get Info for Plugin Test in Environments
    Then The environment information window should be displayed

    When I select plugin tab Governing Settings
    Then The Governing Settings plugin page should be displayed

    When I click on the advanced link
    And I click the OK button to close the plugin window

  @settings
  Scenario: [TC53694] Open the All Settings plugin
    When I select tab Environments
    And I select view listView
    And I select context menu option Get Info for Plugin Test in Environments
    Then The environment information window should be displayed

    When I select plugin tab All Settings
    Then The All Settings plugin page should be displayed

    When I input abc for Message lifetime
    And I click the OK button to close the plugin window
    And I confirm the error massage

    When I click the Cancel button to close the plugin window

