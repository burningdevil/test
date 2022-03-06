import { DialogsModule, ConfirmationSettings, ErrorSettings, SaveDialogSettings, DialogValues, SaveDialogResponse, ObjectEditorResponse, ObjectEditorSettings, ObjectSelectorResponse, ObjectSelectorSettings, PropertiesSettings } from '@mstr/workstation-types'
import { confirmationOptions } from '../common'
import { dialogRes } from './constants'

class Dialogs implements DialogsModule {
  objectSelector(options: ObjectSelectorSettings): Promise<ObjectSelectorResponse> {
    throw new Error('Method not implemented.')
  }
  openProperties(options: PropertiesSettings): Promise<void> {
    throw new Error('Method not implemented.')
  }
  openObjectEditor = async (options: ObjectEditorSettings) => {
    window.open(`${window.location.origin}/#/appDesignEditor`, 'App Design Editor', 'popup')
    return {
      windowId: ''
    }
  } 
  confirmation = async (settings: ConfirmationSettings) => DialogValues.YES

  error = async (settings: ErrorSettings) => DialogValues.OK

  saveAs = async (settings: SaveDialogSettings) => dialogRes as SaveDialogResponse

  // Helper methods for quick access
  showConfirmation = async (options: confirmationOptions) => {
    const { message, additionalInformation, onOptionYes, onOptionNo, onOptionCancel } = options
    const clickedBtn = await this.confirmation({ message, additionalInformation })
    switch (clickedBtn) {
    case DialogValues.YES:
      onOptionYes && onOptionYes()
      break
    case DialogValues.NO:
      onOptionNo && onOptionNo()
      break
    case DialogValues.CANCEL:
      onOptionCancel && onOptionCancel()
      break
    default:
    }
  }
}

const dialogs = new Dialogs()
export default dialogs
