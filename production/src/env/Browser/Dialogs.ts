import { DialogsModule, ConfirmationSettings, ErrorSettings, SaveDialogSettings, DialogValues } from '@mstr/workstation-types'
import { confirmationOptions } from '../common'

const res = {
  canOverwrite: true,
  folder: {
    id: '8D67908E11D3E4981000E787EC6DE8A4',
    name: 'My Personal Objects'
  },
  name: 'Untitled Filter',
  shouldCertify: false
}

class Dialogs implements DialogsModule {
  confirmation = async (settings: ConfirmationSettings) => DialogValues.YES

  error = async (settings: ErrorSettings) => DialogValues.OK

  saveAs = async (settings: SaveDialogSettings) => res

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
