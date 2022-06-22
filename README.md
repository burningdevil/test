<!--
    The purpose of this file is to allow readers who find this repository in git to know about the purpose of the repository.  Please:
    - Duplicate this file into the root of your repository (as README.md)
    - The seconds marked in HTML comments should be filled in with actual text
    - The purpose of Begin/End markers are to allow scripts to scan this file.

    Add any other information that you think will be helpful for readers of this repository.
    If the documentation requested here is already written elsewhere (say in Confluence)
    then please just place a link here to allow people to discover the documentation.

    This file should be in the root of the repository.
    If the project already contains a readme repo that is not at the root,
    For example: https://github.microstrategy.com/Kiai/ExportService/tree/m2021/production
    Then we should just provide a readme.md at the root that points to the location of
    the existing readme file to allow it to be found.

    An example of a good readme is here:
    https://github.microstrategy.com/Modules/DBMigrator/blob/master/README.md

-->

# <!-- Begin: Full Name -->Common name of repo (for example say "Library Server" not "web-dossier")<!-- End: Full Name -->

## Summary

### Purpose

<!-- Begin: Purpose -->

_What does the material in this repository actually do?_

<!-- End: Purpose -->

### How, if at all, do we ship the code in this repository

<!-- Begin: Output
    Please fill in the [x] if a statement is true, remove it if it is false.
    List all of the separately shipping products that include it.
    If (for low-level code) it is included in many projects then categorize them
-->

- [x] This project is shipped (included in some kind of install program)
  - Product_1
  - Product_2 etc.
  <!-- Alternatively:
      - [ ] This project is shipped (included in some kind of install program)
  -->
- [x] This project is containerized (it is included in some MicroStrategy generated container)
  - Container_1
  - Container_2 etc.
  <!-- Alternatively:
      - [ ] This project is containerized (it is included in some MicroStrategy generated container)
  -->
- [x] This project is actively used in-house. (For example it is a build tool, or it is used for testing.)
<!-- Alternatively:
    - [ ] This project is actively used in-house.  (For example it is a build tool, or it is used for testing.)
-->
- [x] This is a throw away project (created for research)
<!-- Alternatively:
    - [ ] This is a throw away project (created for research)
-->
- [x] This code belongs to MicroStrategy (as against being open source)
  <!-- Alternatively:
      - [ ] This code belongs to MicroStrategy (as against being open source)
  -->
  <!-- End: Output -->

### Ownership

<!-- Begin: Owner
    If a repo belongs to several teams write down the team that owns the largest proportion.
    This information can be found here:
    https://microstrategy.atlassian.net/wiki/spaces/DevOps/pages/1070727930/CI+pipelines+Point+of+Contacts
    Example:
        Team: TEC-CT-Web-Library-CTC
        Team: TEC-SR-Gateways-Framework
        Contact: Fred Bloggs
-->

Team: _State which team owns the repository. Use the BU name for the team._
Contact: _State an individual within the team to use as a point of contact._

<!-- End: Owner -->

## Documentation

<!-- Begin: Documentation -->

_Please provide a brief overview over how the contents of this repo are organized. If there exist documents in Confluence or Sharepoint that describe the top-level design of the repository please include them here. You might also link to documentation included in the repo using a relative link._

_The goal here is to write enough to give someone looking at the repository for the first time some idea how to get started upon it._

<!-- End: Documentation -->

## How to use this repository

<!-- Begin: Use -->

_For source code, describe what tool(s) an engineer should use to set up a development environment on this repository. Recommend an IDE to use and specify where to find the project file (or the equivalent) to set up the IDE correctly. If the program should be built from the command line describe what should be installed, and the correct command line command to execute._

_If this repository contains executable code describe how one could execute and debug the code in the repository._

_If the repository implements a library then describe how to include the library in other projects (e.g. use this jar file etc.)._

_If the repository does not contain source code, then describe how it should be used._

<!-- End: Use -->

## Build Pipeline

<!-- Begin: Build -->

_Repositories that contain code that we ship are intended to be integrated into the CI build pipeline. Describe how this is implemented._

_Describe trouble shooting steps one should take if there is a problem with this repository's build pipeline. If there is a slack channel that reports builds for this repo, please link to it here as well._

<!-- End: Build -->

## Automated tests for this repository

<!-- Begin: Test -->

_Many repositories contain automated tests, or are intended to be tested by system tests. If the project contains automated tests specify where to find them and how to execute them. If other tests should be executed describe where to find them and how to execute them instead._

<!-- End: Test -->

## Security scanning integration

The scanning tools in use for this project:

<!-- Begin: Scanning -->

<!--
    If the repo is scanned by SonarQube then fill in a link on where to see outcome
    If the repo is not scanned then uncheck the box and erase the link.
-->

- [x] This project is scanned by SonarQube. See [dashboard link](https://sonarqube.internal.microstrategy.com/dashboard)

<!--
    If the repo is scanned by Veracode then fill in a link on where to see outcome
    If the repo is not scanned then uncheck the box and erase the link.
-->

- [x] This project is scanned by Veracode. See [dashboard link](https://web.analysiscenter.veracode.com/)

<!-- End: Scanning -->

<!--
    Please make sure that this repo's information is up to date in this spreadsheet.
-->

[Link to spreadsheet containing information about automated security scanning](https://microstrategy-my.sharepoint.com/:x:/p/xchang/EZ1JApOcDZpGnwbkKLVnZ70BJfrnBSQbF26bXYLS5OntHw?e=ZMVpVe)
