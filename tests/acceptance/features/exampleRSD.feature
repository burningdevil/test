Feature: CEF support for the RSD plugin
  Workstation uses CEF as the webview to support the plugins. This feature covers the support for RSD plugin. 
  RSD has two entry points: 
  1. Click on the plus button besides Documents. 
  2. Right mouse click on a document, then select "Edit Document"
#####
# Example Test Scenario for Quick Search in Workstation Mac with CEF
# Author: Lun  10/07/2019
#####
  @rsd
  Scenario: [TC53696] Click on the plus button besides Documents to create new document
    When I select tab Documents
    And I create a new item Document
    And I select MicroStrategy Tutorial and click select
    Then The new RSD window should be present

    When I select the 01 Blank Dashboard in create new document window
    Then The RSD scale setting with 100% should be displayed

    When I change the scale from 100% to 125%
    And I close the RSD Window
    And I select Yes to close the RSD Window

  @rsd1
  Scenario: [TC53696] Select edit document in the documents context menu
    When I select tab Documents
    And I select view listView
    And I select context menu option Edit Document for R1_D in Documents
    Then The new RSD window should be present

    When I close the RSD Window