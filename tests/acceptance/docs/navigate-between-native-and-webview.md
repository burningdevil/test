# Navigation Between Workstation Native and CEF WebView
It's apparent when we are running the E2E tests, we are using two drivers: one for manipulating the native (either `WinAppDriver` or `appium-mac-driver`), the other for manipulating the CEF Webview (chrome driver).

We by now know how to handle the test automation against the Workstation native part outside the WebView, as well as against inside the CEF Webview. However, how we should navigate between the Native Window and the CEF WebView has not been touched yet. This is the core of how we can do an E2E test from the end-users' point of view. It mainly includes the following parts:
- navigation between different native windows
- navigation between different WebView apps
- navigation between the native windows and the Webview apps

## Navigation Between Native Windows
### Navigation in Workstation Mac
Navigation between different native windows in Workstation Mac is quite straight forward as any new windows/popups/dialogs from the AXPath are still under the same application. This means there is no application target change and it's generally another different AXPath in this application UI.
### Navigation in Workstation Windows
As for Workstation Windows, things become a little tricky. As you can see from the screenshot below, when you create a new Dossier Editor, it is a standalone window in the level as the MicroStrategy Workstation Window. Then we have to switch the window handle to find any specific element in the newly open window.

We handle this situation by enumerating all top-level windows belonging to an active Windows Application Driver session through the WindowHandles attribute, which is the situation for Dossier Editor and the Workstation Window - they are from the same Application session. After we enumerate them, we can switch the active session to any of them and interact with one of them at a time.

We implement this workflow by utilizing a window handle Map called `windowMap`. Whenever a new Window is created, we put the window handle to our map with the name we specified; And whenever we close the Window, we remove this window handle on the map. We can switch between all these windows easily by just switching the window handles. All functions are in [`windowHelper.js`](../utils/wsUtils/windowHelper.js) file

## Navigation Between different WebView Applications
As we mentioned before, different CEF plugin applications are considered as different browser tabs. We provide standard methods `switchToNewWebView` and `switchToDefaultWebView` in the BasePage object of the Web Applications to handle these actions.

## Navigation Between Native and WebView
The lifecycle of the CEF Webview is something needs attention here. 

Still use Dossier Editor as an example: when the Dossier Editor is open, we have the native window for the Editor; Inside the editor, the WebView container (which is still native) is created invisibly. The Web Application is hosted in this WebView container. Before you would like to interact with the real product functionalities inside the WebView, you have to switch your window focus from the previous native Window(Workstation Main Window) to the newly opened window(Dossier Editor) first, then switch your webview to the newly instantiated Web Application. Before you close the Dossier Editor, to make sure the Protractor always have an active browser session, you need to switch the webview back to the default first, and then close the native Window and switch back to another window.


## Concluded Workflow to Follow
The above content is quite a detail but may sound not clear enough to you. To make it more simple, please follow the rules as below.

- Implement the navigations inside the step definitions
- Open a New Window
    - (Only for Windows) Register the Window to `windowMap` by calling function `registerNewWindow(windowName)`; Switch to the new window by calling function `switchToWindow(windowName)`. 
    - Switch to the new web application by calling method `switchToNewWebView()`
- Close the Current Window
    - Switch back to the default webview before closing the window, by calling `switchToDefaultWebView()`
    - (Only for Windows) Close the current Window, switch to the next Window you will working on by calling the function `switchToWindow(windowName)`, and then unregister the close window by calling function, and then `unregisterWindow(windowName)` 

## Read More
[Navigation Between Native and WebView](https://microstrategy.atlassian.net/wiki/spaces/AB/pages/858243547/6+-+Navigation+Between+Native+Window+and+CEF+WebView)