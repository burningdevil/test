# Stability Test

## Overview

Test stability of the feature by running test cases in random order and length for a specified duration.
This stability test includes all the following details.

- Script needs to run continuously for a long period of time.
- Test cases should be randomly chosen in the script to simulate the actual user behavior.
- Take cucumber tags randomly
- Take different sizes of tags for each run.
- Script should not stop even when there is error.
- Simulate error rate, and if reaches its limit, exit the script.

## Requirements

Add the test cases(cucumber tags ) needs to be run for the test in file: test_stability.js, modify the tagsArray constant.

## Execute

- Input total duration for script to run
- maxErrorRatio is an optional parameter, input to set maximum error rate. By default it is 0.5.

```
node test_stability.js durationInHrs maxErrorRatio
```

For detailed information on how the script works refer to the [page](https://microstrategy.atlassian.net/wiki/spaces/TTWF/pages/827332679/Automation+for+Stability+Test)
