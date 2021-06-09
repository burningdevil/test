import {
  DialogsModule, ConfirmationSettings, ErrorSettings, SaveDialogSettings,
  DialogValues,
  ObjectEditorResponse,
  ObjectEditorSettings,
  ObjectSelectorResponse,
  ObjectSelectorSettings,
  PropertiesSettings
} from '@mstr/workstation-types'
import { confirmationOptions } from '../common'

declare var workstation: any

class Dialogs implements DialogsModule {
  objectSelector(options: ObjectSelectorSettings): Promise<ObjectSelectorResponse> {
    throw new Error('Method not implemented.')
  }
  openProperties(options: PropertiesSettings): Promise<void> {
    throw new Error('Method not implemented.')
  }
  openObjectEditor(options: ObjectEditorSettings): Promise<ObjectEditorResponse> {
    throw new Error('Method not implemented.')
  }
  confirmation = (settings: ConfirmationSettings) => workstation.dialogs.confirmation(settings)

  error = (settings: ErrorSettings) => workstation.dialogs.error(settings)

  saveAs = (settings: SaveDialogSettings) => workstation.dialogs.saveAs(settings)

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
