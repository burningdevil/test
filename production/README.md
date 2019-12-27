# MicroStrategy Workstation Plugin Application Template

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

## Requirements

* node `^8.0.0`
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
