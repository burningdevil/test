#MAC LOCATOR STRATEGIES
There are different locating strategies for mac and Windows.
Mac only allows us to find elements using axpath

##BASIC RULES FOR A VALID AXPATH SELECTOR
- Must begin with /AXApplication.
- Must contain at least one other node following /AXApplication.
- Does not contain "//", or use a wildcard, or specify multiple paths using |.
- May use boolean operators and or or in between multiple comparisons, but may not include both and and or in a single - statement. and and or must be surrounded by spaces.
- Uses single quotes, not double quotes for attribute strings.
- Does not contain spaces except inside quotes and surrounding the and and or operators.
- Does not use predicate strings containing braces [] or parentheses ().

##WRITING AND USING AXPATH
- Creating constants: 
    If an element has more childern, define a constant to get the window and use it for all the children elements. You can check the list of children elements from Accessibility Inspecter -> Advanced -> children Click on the eye icon to the right corner of children to see the list.

- Passing parameters: 
    To paramerize the AXPath, you can do it in 2 ways.
        - create a variable and pass variable from the xpath file. Refer to the constants created in the mac_xpath.js file for this.
        - append the xpath in the function you want to parameterize in. Refer to the usage of smartTab.tab for this.
- We can use the any of the AX element locators listed in this link (https://github.com/appium/appium-for-mac/blob/master/Frameworks/PFAssistive.framework/Versions/L/Headers/PFUIElement.h)

-Categorize sections:
    Create all your AXPaths inside the constant mac_Xpath. Categorize the sections based on the windows.

##USEFUL REFERENCES
* [Appium for MAC](https://github.com/appium/appium-for-mac)
* [How to find absolute AXPath of an element](https://microstrategy.atlassian.net/wiki/spaces/TEAMEDG/pages/684311122/How+to+find+absolute+AXPath+of+an+element)