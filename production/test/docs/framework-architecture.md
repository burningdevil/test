# Workstation E2E Test Automation Framework Architecture

The main ideas of this Test Framework are:
- It should apply to both Workstation Windows and Mac, as functionality-wise, Workstation Windows and Mac should have no gap.
- It should reuse the automation script for Web Component for Workstation Windows and Mac, as the same shared Web Components will be used.
- It should reuse the other reusable patterns, such as implementation for element actions and assertions.

## Framework Overview

![Framework Overview](./images/appTestFramework.png)

