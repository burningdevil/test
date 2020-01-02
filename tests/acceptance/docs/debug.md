
# Debug Your Code
## Run Your Test Only
One simple way to only run your test scenario is to put a special tag for it: `@debug`. Then you can pass in the tag when running the test command:

```
yarn test --cucumberOpts.tags '@debug'
```

## Node Debugger
[ndb](https://github.com/GoogleChromeLabs/ndb) is highly recommended for debugging your test script.

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