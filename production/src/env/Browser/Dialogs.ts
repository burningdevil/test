import { DialogsModule, ConfirmationSettings, ErrorSettings, SaveDialogSettings, DialogValues } from '@mstr/workstation-types'
import { confirmationOptions } from '../common'
import { dialogRes } from './constants'

class Dialogs implements DialogsModule {
  confirmation = async (settings: ConfirmationSettings) => DialogValues.YES

  error = async (settings: ErrorSettings) => DialogValues.OK

  saveAs = async (settings: SaveDialogSettings) => dialogRes

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
