import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../../../store/createStore';
import rootState from '../../__mocks__/mock_state';
import CustomEmailForm from '../../../../../../src/modules/components/features/custom-email/email-form/email-form';


describe('Customize Email Form Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('Application customize email: test enable custom email', async () => {
    const store = createStore(rootState);
    // Render
    const { queryAllByRole, queryByDisplayValue } = render(
      <Provider store={store}>
        <CustomEmailForm />
      </Provider>
    );
    const checkboxes = queryAllByRole('checkbox');
    const enableCustomEmailCheckbox = checkboxes[0];
    expect(enableCustomEmailCheckbox).toBeInTheDocument();
    expect(enableCustomEmailCheckbox).toBeChecked();
    
    fireEvent.click(enableCustomEmailCheckbox);
    expect(enableCustomEmailCheckbox).not.toBeChecked();

  });

  it('Application customize email: test custom email form', async () => {
    const store = createStore(rootState);
    // Render
    const { queryAllByRole, queryByDisplayValue } = render(
      <Provider store={store}>
        <CustomEmailForm />
      </Provider>
    );
    const formContainer = document.querySelector('#custom-email-form');


    

  });

  
});
