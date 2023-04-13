import RootApp from '../basePages/RootApp'
import { wsNativeWindows } from "../../config/constants";
const contentGroupInfo = MAC_XPATH_GENERAL.contentGroupInfo
const wd = require('wd')
const { registerNewWindow, switchToWindow, unregisterWindow } = require('../../utils/wsUtils/windowHelper')

export default class ContentGroupInfoDialog extends RootApp {
    // ** Locators ** //
    async getContentGroupNameLabel(name) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: 'Name', value: name }
                ]
            },
            mac: { xpath: contentGroupInfo.title.replace(/ReplaceMe/g, name) }
        })
    }

    async getCloseWindowButton(name) {
        return this.getNativeElement({
            windows: {
                locators: [
                    { method: 'Name', value: name },
                    { method: 'AccessibilityId', value: 'WindowCloseButton' }
                ]
            },
            mac: { xpath: contentGroupInfo.closewindowbutton.replace(/ReplaceMe/g, name) }
        })

    }

    // actions
    async closeContentGroupInfoWindow(name) {
        await switchToWindow(wsNativeWindows.contentGroupInfo)
        await this.moveToAndClick(await this.getCloseWindowButton(name))
        await unregisterWindow(wsNativeWindows.contentGroupInfo)
        return this.app.sleep(1000)
    }

    // assertions
    async isContentGroupNameDisplayed(name) {
        try {
            const elem = await this.getContentGroupNameLabel(name)
            return elem.isDisplayed()
        } catch (err) {
            return false
        }
    }
}