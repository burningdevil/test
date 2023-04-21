import * as React from 'react'
import { mount } from 'enzyme'
import { ConfirmationDialog } from '../common-components/confirmation-dialog/confirmation-dialog'


const mockProps = {
  isConfirmationDialogDisplayed: true,
  triggerAction: jest.fn(),
  closeDialog: jest.fn(),
  wordings: {
    title: 'Delete Confirmation',
    actionButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    summaryText: 'Items to be deleted',
    detailText: 'This operation cannot be undone.'
  }
}

describe('Delete Confirmation Dialog Snapshot Test Set', () => {
  it('Default Confirmation Dialoig Snapshot Test', () => {
    const wrapper = mount(<ConfirmationDialog {...mockProps} />)

    expect(wrapper.debug()).toMatchSnapshot()
  })
})
