import {
  DialogsModule, ConfirmationSettings, ErrorSettings, SaveDialogSettings,
  DialogValues
} from '@mstr/workstation-types'
import { confirmationOptions } from '../common'

declare var workstation: any

class Dialogs implements DialogsModule {
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
