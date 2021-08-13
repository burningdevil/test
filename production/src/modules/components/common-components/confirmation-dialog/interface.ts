export type ConfirmationDialogWordings = {
  title: string
  actionButtonText: string
  cancelButtonText: string
  summaryText: string
  detailText?: string
}

export interface ConfirmationDialogProps {
  isConfirmationDialogDisplayed: boolean
  triggerAction: () => void
  closeDialog: () => void
  wordings: ConfirmationDialogWordings
}
