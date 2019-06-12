#LOCATOR STRATEGIES FOR NATIVE PAGES
Both windows and mac have different locating strategies.

Mac only allows to find elements using xpath.

Where as, windows support multiple locator strategies.
We can get elements in windows by name, classname, AccessibilityId and xpath.
It is not ideal to always use xpath for windows.

Inorder to resolve the issue of using different locator strategies for both mac and windows, we defined a method getNativeElement(obj) that can compose the elements based on it's platform operating system.
This method is place in the RootApp.js file, meaning it is available in all the page js files.
Any getter functions in the pages should use this method to locate elements.

All the elements locator values uses json structure.

Example for using getNativeElement(obj):
getExample(parameter) {
    return this.getNativeElement({
      windows:{ 
        locators: [
          { method: 'Name', value: `${parameter}s` },
          { method: 'ClassName', value: 'Button' },
        ]},
      mac: { xpath: pageObjectName.methodName.replace('ReplaceMe', parameter) }
    });
  }

##MAC LOCATOR STRATEGIES
Mac only supports to elementByXPath().
xpath for mac is written in a file and placed in this location, react.mud/production/test/utils/envUtils/mac_xpath.js

###BASIC RULES FOR A VALID AXPATH SELECTOR
- Must begin with /AXApplication.
- Must contain at least one other node following /AXApplication.
- Does not contain "//", or use a wildcard, or specify multiple paths using |.
- May use boolean operators and or or in between multiple comparisons, but may not include both and and or in a single - statement. and and or must be surrounded by spaces.
- Uses single quotes, not double quotes for attribute strings.
- Does not contain spaces except inside quotes and surrounding the and and or operators.
- Does not use predicate strings containing braces [] or parentheses ().

###WRITING AND USING AXPATH
- Creating constants: 
    If an element has more childern, define a constant to get the window and use it for all the children elements. You can check the list of children elements from Accessibility Inspecter -> Advanced -> children Click on the eye icon to the right corner of children to see the list.

- Passing parameters: 
    To paramerize the AXPath, put a place holder 'ReplaceMe'. This string can be changed by using string.replace() in the pageObject methods.

- We can use the any of the AX element locators listed in this [link] (https://github.com/appium/appium-for-mac/blob/master/Frameworks/PFAssistive.framework/Versions/L/Headers/PFUIElement.h) to locate xpath.

-Categorize sections:
    Create all your AXPaths inside the constant mac_Xpath. Categorize the sections based on it's category.

###Tips
1. Easiest way to get the axpath:
    make sure appium is started
    fn key + mouse over to the element
    paste in your file to see the axpath.

2. On writing axpath using the accessibility inspector, remember that AXLabel element locator doesn't work. To see all the element locators you can see check the list given above.


###USEFUL REFERENCES
* [Appium for MAC](https://github.com/appium/appium-for-mac)
* [How to find absolute AXPath of an element](https://microstrategy.atlassian.net/wiki/spaces/TEAMEDG/pages/684311122/How+to+find+absolute+AXPath+of+an+element)

##WINDOWS LOCATOR STRATEGIES
Windows support multiple element locator strategies.
Currently in use are:
 - elementByName()
 - elementByClassName()
 - elementByAccessibilityId()
To add more locating straties modify the getNativeElement().

To locate the elements in windows, use the getNativeElement().
Pass a json object to the method like this:
windows:{ 
        locators: [
          { method: 'Name', value: `${parameter}s` },
          { method: 'ClassName', value: 'Button' },
        ]}
You can add or delete locators based on the requirement.