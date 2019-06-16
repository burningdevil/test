# How To Locate Elements

## MAC Native Element Locators
Appium Mac Driver only supports to locate elements by AXPath. As a reault, all the WD methods corresponding to /elements JsonWireProtocal methods will fail. And we can only use elementByXpath() method to locate an element.
Xpath for elements in mac is written in a file and placed under `/utils/envUtils/mac_xpath.js`

### Tools To Use
1. Getting AXPath with Appium:
- make sure appium is started
- fn key + mouse over to the element
- paste in your file to see the axpath.

2. Inspect AXPath with Accessiblity Inspector
- open Mac Desktop Application Accessibility Inspector
- select Workstation as target, inspect the elements
- On writing axpath using the accessibility inspector, remember that AXLabel element locator doesn't work. To check all the supported element attributes see this [list](https://github.com/appium/appium-for-mac/blob/master/Frameworks/PFAssistive.framework/Versions/L/Headers/PFUIElement.h)


### Basic Rules For A Valid AXPath Selector
- Must begin with /AXApplication.
- Must contain at least one other node following /AXApplication.
- Does not contain "//", or use a wildcard, or specify multiple paths using |.
- May use boolean operators and or or in between multiple comparisons, but may not include both and and or in a single - statement. and and or must be surrounded by spaces.
- Uses single quotes, not double quotes for attribute strings.
- Does not contain spaces except inside quotes and surrounding the and and or operators.
- Does not use predicate strings containing braces [] or parentheses ().

### Writing And Using AXPath
- Creating constants: 
    If an element has more childern, define a constant to get the window and use it for all the children elements. You can check the list of children elements from Accessibility Inspecter -> Advanced -> children Click on the eye icon to the right corner of children to see the list.

- Passing parameters: 
    To paramerize the AXPath, put a place holder 'ReplaceMe'. This string can be changed by using string.replace() in the pageObject methods.

- Categorize sections:
    Create all your AXPaths inside the constant mac_Xpath. Categorize the sections based on it's category.

### References
* [Appium for MAC](https://github.com/appium/appium-for-mac)
* [How to find absolute AXPath of an element](https://microstrategy.atlassian.net/wiki/spaces/TEAMEDG/pages/684311122/How+to+find+absolute+AXPath+of+an+element)

## Windows Native Element Locators
Windows support multiple element locator strategies. Currently in use are:
 - elementByName()
 - elementByClassName()
 - elementByAccessibilityId()
To add more locating straties modify the getNativeElement().

### Tools To Use
1. Inspect Element with [Appium Desktop](https://github.com/appium/appium-desktop):
- install and launch Appium Desktop
- start Appium Server
- start inspect session
- inspect elements from the inspect session

2. Inspect Element with inspect.exe
- install windows-10-sdk
- launch inspect.exe under the `Windows kits\{version}\bin\{osType}` folder
- inspect elements from the inspect.exe window

### Writing Element Locators
To locate the elements in windows, use the getNativeElement(). The element locators can be chained. For example, the locators below will find an elmenet with className 'Button' under element with Name 'Tab' under the app root.

```
windows:{ 
        locators: [
          { method: 'Name', value: `Tab` },
          { method: 'ClassName', value: 'Button' },
        ]}
```

## Web Element Locators

Visit the CEF Remote Debug Mode Url in Chrome. Normally it is `localhost:54213`.
Click on the corresponding link in the web page to access the CEF WebView page.
Use the Chrome Developer Tools to inspect the Web Element.

- Never use xpath locator; Always use css locator.
- Whenever you need to filter multiple Web Elements based on specific conditions, use [`filter()`](https://www.protractortest.org/#/api?view=ElementArrayFinder.prototype.filter), [`map()`](https://www.protractortest.org/#/api?view=ElementArrayFinder.prototype.map), [`reduce()`](https://www.protractortest.org/#/api?view=ElementArrayFinder.prototype.reduce) with css locator.