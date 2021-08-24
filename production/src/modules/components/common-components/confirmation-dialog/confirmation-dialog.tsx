import * as React from 'react'

/* HOC */
import { InformationDialog } from '@mstr/rc'

/* Type */
import { ButtonConfigTypeDef } from '@mstr/rc/types/information-dialog/interface'
import { ConfirmationDialogProps } from './interface'

import './confirmation-dialog.scss'

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { isConfirmationDialogDisplayed, triggerAction, closeDialog, wordings } = props

  /* State */

  /* Event Handler */
  const handleAction = () => {
    triggerAction()
    closeDialog()
  }

  const handleCancel = () => {
    closeDialog()
  }

  const handleWindowClose = () => {
    handleCancel()
  }

  /* ClassName */
  const prefix = 'confirmation-dialog'

  const buttonConfig = [
    {
      title: wordings.actionButtonText,
      className: `${prefix}-action-button`,
      onClick: handleAction,
      type: 'primary',
      size: 'regular',
    },
    {
      title: wordings.cancelButtonText,
      className: `${prefix}-cancel-button`,
      onClick: handleCancel,
    },
  ]

  /* Sub-Components */

  const content = (
    <div className={`${prefix}-dialog-container`}>
      <div className={`${prefix}-warning-icon`}>
        <i className="ws-icon-60 ws-icon-mstr-warning" />
      </div>
      <div className={`${prefix}-content-container`}>
        <div tabIndex={0} className={`${prefix}-summary`}>
          <span>{wordings.summaryText}</span>
        </div>
        <div tabIndex={0} className={`${prefix}-details`}>
        <span>{wordings.detailText}</span>
        </div>
      </div>
    </div>
  )

  return (
      <div className={`${prefix}-wrapper`}>
        <InformationDialog
          isOpen={isConfirmationDialogDisplayed}
          title={wordings.title}
          hideTitle={false}
          content={content}
          buttonConfig={buttonConfig as ButtonConfigTypeDef[]}
          appElement={document.querySelector(`.${prefix}-wrapper`)}
          className={prefix}
          ariaLabel={wordings.title}
          theme= ""
          onClose={handleWindowClose}
        />
      </div>
  )
}

export default ConfirmationDialog
