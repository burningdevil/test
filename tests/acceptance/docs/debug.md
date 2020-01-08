
# Debug Your Code
## Run Your Test Only
If you're still working on this scenario, you mark it as `'@wip'` to avoid any mistakenly run in CI Pipeline. 
To run these features only, you can pass in the tag when running the test command:

```
yarn test --cucumberOpts.tags '@wip'
```

## Protractor Debugger
This boilerplate has set up the Protractor debug setting, in [launch.json](../../.vscode/launch.json)


## Node Debugger
[ndb](https://github.com/GoogleChromeLabs/ndb) is also recommended for debugging your test script.

1.  Install ndb globally

```sh
yarn install -g ndb
```

2.  Write `debugger;` in the line where you want to place the breakpoint.

Example:
```javascript
...

async removeEnv(name) {
    let existingEnv = await this.getExistingEnv(name);
    debugger;
    await this.moveToAndClick(existingEnv);
    await this.rightClick();
    await this.moveToAndClick(await this.getRemoveEnvOption());
    return this.app.sleep(8000);
  }

...
```

3. Launch automation with Node debugger command 'ndb'.

```sh
ndb {npm-run-script}
```

Example:

```sh
ndb npm run test -- --cucumberOpts.tags '@debug'

```