import * as _ from 'lodash'
import { desc } from '../utils/desc'
import * as compareVersions from 'compare-versions'

declare var workstation: any
declare var window: any

// Missing variables and function from the template John created
const CURRENT_VERSION = '11.1.1'
const HYPER_SUBTYPE = 'HYPER'
const preSaveCheck = () => {}
const save = () => {}
const saveAs = () => {}

export class Workstation {
  async getCubeId() {
    let object = await workstation.selectedObject.getCurrent()
    return (object.subType !== HYPER_SUBTYPE) ? object.id : null
  }

  async getReportId() {
    let object = await workstation.selectedObject.getCurrent()
    return (object.subType === HYPER_SUBTYPE) ? object.id : null
  }

  async getHyperName() {
    let object = await workstation.selectedObject.getCurrent()
    return (object.subType === HYPER_SUBTYPE) ? object.name : null
  }
  saveAs = window.workstation && workstation.dialogs.saveAs
  confirm(cfg: any) {
    return new Promise((resolve, reject) => {
      return resolve(window.confirm(cfg.message))
    })
  }
  error(cfg: any) {
    let { fatal, ...params } = cfg
    params = {
      title: desc(16310,'Error'),
      message: desc(16309,'An Error has occurred.'),
      buttonCaption: fatal ? desc(16307,'Close') : desc(16308,'OK'),
      ...params
    }
    let f = window.workstation && workstation.dialogs && workstation.dialogs.error
    let me = this

    return f && f(params).then(() => {
      if (fatal) {
        me.closeWindow()
      }
    })
  }
  async writable() {
    let f = window.workstation && workstation.selectedObject.getIsReadOnly
    let r = false
    if (f) {
      r = await f()
    }
    return !r
  }
  async isServerOutdated() {
    // When web is outdated, disable save button. Other case, as normal
    let f = window.workstation && workstation.utils.getEnvironmentInfo
    let r: any
    if (f) {
      r = await f()
    }
    let webVersion = r.webVersion || '0'
    console.log(compareVersions(webVersion.replace('J', ''), CURRENT_VERSION))
    return compareVersions(webVersion.replace('J', ''), CURRENT_VERSION) < 0
  }
  closeWindow = window.workstation && window.workstation.window.close
  setWindowTitle = window.workstation && workstation.window.setTitle
  postSave = window.workstation && workstation.data.refreshObject
  getHelpBaseUrl = window.workstation && window.workstation.utils.getHelpBaseUrl
  onAppStart(store: any) {
    let me = this
    if (workstation) {
      workstation.menus.addOnSave(() => {
        if (preSaveCheck.call(me, store)) {
          store.dispatch(save())
        }
      })

      workstation.menus.addOnSaveAs(() => {
        if (preSaveCheck.call(me, store)) {
          store.dispatch(saveAs())
        }
      })

      // workstation.window.addOnClose(async () => {
      //   let state = store.getState()
      //   let reportId = selectReportId(state)

      //   let originalCardDef = selectContentOriginalCardDef(state)
      //   let templateDirty = selectContentTemplateDirty(state)
      //   if ((!reportId ||
      //       templateDirty ||
      //       !_.isEqual(JSON.parse(originalCardDef), JSON.parse(toServerFormat(selectCard(state))))) && preSaveCheck.call(me, store)
      //   ) { // if it's a new hyper card, warn user to save
      //     let clickedBtn = await workstation.dialogs.confirmation({ message: desc(16311, 'You haven\'t saved yet. Do you want to save it now?') })
      //     switch (clickedBtn) {
      //     case 1: // save
      //       store.dispatch(saveAndClose())
      //       break

      //     case 0: // don't save and close
      //       me.closeWindow()
      //       break

      //     case -1: // cancel
      //       break

      //     default:
      //     }
      //   } else {
      //     me.closeWindow()
      //   }
      // })
    }
  }
}

export const WorkstationEnv = new Workstation()
