# Microstrategy App Starter Kit (MASK) for Workstation

It is the web app starter kit for Workstation. It's uses React/Redux as its base technology to build the web app. Key technologies also include

- webpack (bundler)
- saga (side effect)
- scss
- babel (ES6)
- ant.design
- eslint
- Unit Tests: jest and enzyme

## Requirements

* node `^8.0.0`
* yarn `^0.23.0` or npm `^3.0.0`


## Building && Running the Project

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

## Build for Workstation

```
npm install
npm run buildWS
```

## Deployment on Workstation

Copy the whole 'dist' folder to workstation corresponding directory. 

```
cp ./dist -rf [workstation deployment directory]
```
