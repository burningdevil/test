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

# <!-- Begin: Full Name -->MicroStrategy Workstation Custom Application Plugin<!-- End: Full Name -->

## Summary

### Purpose

<!-- Begin: Purpose -->
This is the Workstation Plugin for Custom Applications Feature. Used to manage the custom application objects.
<!-- End: Purpose -->


### How, if at all, do we ship the code in this repository

<!-- Begin: Output
    Please fill in the [x] if a statement is true, remove it if it is false.
    List all of the separately shipping products that include it.
    If (for low-level code) it is included in many projects then categorize them
-->
- [x] This project is shipped (included in some kind of install program)
  - Shipped as plugin of workstation installtion build
<!-- Alternatively:
    - [ ] This project is shipped (included in some kind of install program)
-->
- [ ] This project is containerized (it is included in some MicroStrategy generated container.
<!-- Alternatively:
    - [ ] This project is containerized (it is included in some MicroStrategy generated container.
-->
- [ ] This project is actively used in-house.  (For example it is a build tool, or it is used for testing.)
<!-- Alternatively:
    - [ ] This project is actively used in-house.  (For example it is a build tool, or it is used for testing.)
-->
- [ ] This is a throw away project (created for research)
<!-- Alternatively:
    - [ ] This is a throw away project (created for research)
-->
- [x] This code belong to MicroStrategy (as against being open source)
<!-- Alternatively:
    - [ ] This is a throw away project (created for research)
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
        Team: CT-Applications-CTC  
        Contact: @enli
<!-- End: Owner -->


## Documentation

<!-- Begin: Documentation -->
It is the web app starter kit for Workstation. It uses React/Redux as its base technology to build the web app. Key technologies also include

- webpack (bundler)
- saga (side effect)
- scss
- babel (ES6)
- ant.design
- eslint
- Unit Tests: jest and enzyme

You can find some other features we are planning to add in the following Confluence page.
https://microstrategy.atlassian.net/wiki/spaces/TTWA/pages/748590656/Workstation+Plugin+App+Template+High+Level+Requirements
<!-- End: Documentation -->


## How to use this repository
## Requirements

* node `^16.0.0`
* yarn `^0.23.0` or npm `^3.0.0`

## Installation

## Building and Running the Project

After completing the [installation](#installation) step, you're ready to start the project!

```
$ yarn start  # Start the development server (or `npm start`)
```

### Configure the Library Server to connect to

1. create a file named *.librc.json* under folder __production/server__
2. specify the connection info with json structure like

```json
{
  "server": "http://localhost:8282",
  "base": "/consume-dev",
  "username": "tqmsuser",
  "password": "",
  "projectID":"B628A31F11E7BD953EAE0080EF0583BD"
}
```

## Create You Own Application
Under src/modules folder, you will find three example pages. Two of them are React based modules and Module 2 is actually a mojo based web application.

If you look at App.tsx file, you will find the routes that are linked to each of the modules.

    <div>
      <Route path="/m1" component={Module1} />
      <Route path="/m2" component={Module2} />
      <Route path="/m3" component={Module3} />
    </div>

Then if you look at public/main.js file, you will something like below.

    /index.html#/m1

This is hash based router we are using. In this way, you can define multiple targets in your plugin configuration. The use case can be you have different pages that could be opened by different entry points in Workstation.

You can start deleting all the modules here and adding your own app implementation.

One more thing you can remove is in the index.html file. This section is just an example of how you can add external JavaScript dependencies. Once you have these dependencies added, you can build your module similar to Module 2 in the examples to use these external dependencies.

    <!-- Remove this section from this page if you don't have any mojo related modules. -->
    <script src="./mojo/Module2-mojo-config.js"></script>
    <script src="./mojo/Module2-mojo.js"></script>
    <script src="./mojo/Module2-mojo-my-button.js"></script>
    <!-- End mojo dependencies. -->

## Update from Template
From while to while, there might new common changes added to this template repository. If your application repository is derived from this template, you can use the following Git commands to inherit those latest changes from the template.

    git remote add plugin-template git@github.microstrategy.com:ecosystem/react.mud.git
    git fetch --all
    git checkout m2020
    git merge plugin-template/app

## Build for Workstation

```
npm install
npm run buildWS
```

## Deployment on Workstation

TBD for plugin infrastructure

## CI Metrics Generation

```sh
npm run metrics
```


## Mock Server

### Prepare

yarn add mockjs
yarn add express
yarn global add babel-cli
yarn add --dev babel-preset-env

### Start Script

yarn serve

### Mock Data Dir

mock


## Security scanning integration

The scanning tools in use for this project:

<!-- Begin: Scanning -->

<!--
    If the repo is scanned by SonarQube then fill in a link on where to see outcome
    If the repo is not scanned then uncheck the box and erase the link.
-->
- [x] This project is scanned by SonarQube.  See [dashboard link](https://sonarqube.internal.microstrategy.com/dashboard?id=Kiai%3Aworkstation-homescreen-admin)

<!--
    If the repo is scanned by Veracode then fill in a link on where to see outcome
    If the repo is not scanned then uncheck the box and erase the link.
-->
- [x] This project is scanned by Veracode.  See [dashboard link](https://sca.analysiscenter.veracode.com/workspaces/qWWImWd/projects/454942/vulnerabilities)

<!-- End: Scanning -->

<!-- 
    Please make sure that this repo's information is up to date in this spreadsheet.
-->
[Link to spreadsheet containing information about automated security scanning](https://microstrategy-my.sharepoint.com/:x:/p/xchang/EZ1JApOcDZpGnwbkKLVnZ70BJfrnBSQbF26bXYLS5OntHw?e=ZMVpVe)
