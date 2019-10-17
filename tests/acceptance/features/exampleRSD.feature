Feature: CEF support for the RSD plugin
  Workstation uses CEF as the webview to support the plugins. This feature covers the support for RSD plugin. 
  RSD has two entry points: 
  1. Click on the plus button besides Documents. 
  2. Right mouse click on a document, then select "Edit Document"
#####
# Example Test Scenario for RSD plugin in Workstation Mac with CEF
# Author: Lun  10/07/2019
#####
  @rsd
  Scenario: [TC53696] 1. Click on the plus button besides Documents to create new document. 2. Select edit document in the documents context menu
    When I select tab Documents
    And I create a new item Document
    And I select Web Viewer Test and click select
    Then The New Document RSD window should be present

    When I select the 01 Blank Dashboard in create new document window
    Then The RSD scale setting with 100% should be displayed

    When I change the scale from 100% to 125%
    And I close the 01 Blank Dashboard RSD Window
    And I select Yes to close the RSD Window

    When I select tab Documents
    And I select view listView
    And I select context menu option Edit Document for Balanced Scorecard in Documents
    Then The Balanced Scorecard RSD window should be present

    When I directly close the Balanced Scorecard RSD Window