# features/example.feature
Feature: Example For Workstation Automation for Metric Plugin on CEF
  As a SET
  I would like to verify the Test Infrastructure (Appium + Protractor)
  For Workstation Windows and Workstation Mac with CEF for Metric Plugin

#####
# Example Test Scenario for Quick Search in Workstation Mac with CEF
# Author: qfan  09/17/2019
#####
  @metricEditor
  Scenario Outline: [TC53695] Metric Editor plugin in Workstation Mac with CEF

    #Editing a metric
    When I select folderMode on navigation bar
    When I select environment folder <selectedTabName>
    When I double click to expand or collapse <selectedTabName>
    When I select environment folder <selectedTabName1>
    When I double click to expand or collapse <selectedTabName1>
    When I select environment folder <selectedTabName2>
    When I double click to expand or collapse <selectedTabName2>
    When I select environment folder <selectedTabName3>
    When I double click to expand or collapse <selectedTabName3>
    When I select environment folder <selectedTabName4>
    When I double click to expand or collapse <selectedTabName4>
    When I select view listView
    When I select context menu option Edit Metric for Cost of type Metrics
    Then Metric editor window should be displayed
    When I click button <button> in SimpleMode
    When I click popup button <popUpButton>
    Then Metric editor window should NOT be displayed


    # Creating a new metric
    When I select context menu option New Metric for Cost of type Metrics
    Then Metric editor window should be displayed
    Then I choose metric editor function <functionName>
    Then I switch to formula editor
    And I choose function editor option Clear
    When I double click on <functionName>
    When I provide input <text>
    When I click validate button
    Then Formula should be valid
    When I name metric as <metricName>
    When I click button Save in EditorMode
    Then Dialog titled New Metric should be displayed
    When I click save for dialog titled New Metric
    When I refresh workstation cache
    When I select context menu option Delete for <metricName> of type Metrics

    #Restoring View
    When I double click to expand or collapse <selectedTabName4>
    When I double click to expand or collapse <selectedTabName3>
    When I double click to expand or collapse <selectedTabName2>
    When I double click to expand or collapse <selectedTabName1>
    When I double click to expand or collapse <selectedTabName>
    When I select smartMode on navigation bar
    When I select view iconView



    Examples:
      | tabName      | itemName               | itemType    | selectedTabName | selectedTabName1       | selectedTabName2 | selectedTabName3 | selectedTabName4 | button | popUpButton | functionName | text     | metricName       |
      | Applications | MicroStrategy Tutorial | Plugin Test | Plugin Test     | MicroStrategy Tutorial | Public Objects   | Metrics          | Sales Metrics    | Cancel | No          | Count        | Customer | Automated Metric |