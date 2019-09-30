# features/example.feature
Feature: Example For Workstation Automation for Metric Plugin on CEF
  As a SET
  I would like to verify the Test Infrastructure (Appium + Protractor)
  For Workstation Windows and Workstation Mac with CEF for Metric Plugin

#####
# Example Test Scenario for Quick Search in Workstation Mac with CEF
# Author: Saad  09/17/2019
#####
  @metricEditor
  Scenario Outline: [TC53695] Metric Editor plugin in Workstation Mac with CEF

    #Editing a metric
    When I select folderMode on navigation bar
    When I select environment folder <selectedFolderName>
    When I double click to expand or collapse <selectedFolderName>
    When I select environment folder <selectedFolderName1>
    When I double click to expand or collapse <selectedFolderName1>
    When I select environment folder <selectedFolderName2>
    When I double click to expand or collapse <selectedFolderName2>
    When I select environment folder <selectedFolderName3>
    When I double click to expand or collapse <selectedFolderName3>
    When I select environment folder <selectedFolderName4>
    When I double click to expand or collapse <selectedFolderName4>
    When I select view listView
    When I select context menu option Edit Metric for Cost of type Metrics
    Then Metric editor window should be displayed
    When I click button Cancel in FunctionEditor
    When I click popup button No
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
    When I click button Save in FormulaEditor
    Then Popup should be displayed in editor New Metric
    When I click save for popup in editor New Metric
    When I refresh workstation cache
    When I select context menu option Delete for <metricName> of type Metrics

    #Restoring View
    When I double click to expand or collapse <selectedFolderName4>
    When I double click to expand or collapse <selectedFolderName3>
    When I double click to expand or collapse <selectedFolderName2>
    When I double click to expand or collapse <selectedFolderName1>
    When I double click to expand or collapse <selectedFolderName>
    When I select smartMode on navigation bar
    When I select view iconView



    Examples:
      | tabName      | itemName               | itemType    | selectedFolderName | selectedFolderName1       | selectedFolderName2 | selectedFolderName3 | selectedFolderName4  | functionName | text     | metricName       |
      | Applications | MicroStrategy Tutorial | Plugin Test | Plugin Test     | MicroStrategy Tutorial | Public Objects   | Metrics          | Sales Metrics     | Count        | Customer | Automated Metric |
