
# Common Errors

## General
### Error: Fail to launch Workstation and 'The environment you requested was unavailable'
- Check if the args.appPath.mac/args.appPath.windows value is the correct Workstation Application Path.
- Appium may be started inproperly. Please kill the current process occupying port 4723 and then try to start Appium again.

### Error: connect ECONNREFUSED 127.0.0.1:4723
Appium not started / failed to start

## Windows
### Error: Windows - 'Could not verify WinAppDriver install; re-run install'
- One possible cause is a version mismatch. Check if you already have 'Windows Application Driver' installed, uninstall it from Windows Control Panel. Then try to uninstall and install appium node module again.
- Another cause may be the installation failed due to permission problem. Launch the tool you are running the script with 'Run as Administrator'. Try to uninstall and install appium node module again.

## Mac
### Error: Fails at the first element locator method after Workstation launched
Check if the tool you are running the test with has been enabled to use the Accessibility APIs of Mac OS X
