import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import HomeScreenMoreSetting from '../views/HomeScreenMoreSetting';
import rootState from './__mocks__/mock_state';


describe('HomeScreenMoreSetting Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('Application more settings: test section Access', async () => {
    const store = createStore(rootState);
    // Render
    const { queryAllByRole, queryByDisplayValue } = render(
      <Provider store={store}>
        <HomeScreenMoreSetting />
      </Provider>
    );
    // Check `Allow users to access preferences` check box
    const checkboxes = queryAllByRole('checkbox');
    const preferencesCheckBox = checkboxes[0];
    expect(preferencesCheckBox).toBeInTheDocument();
    expect(preferencesCheckBox).toBeChecked();
    
    fireEvent.click(preferencesCheckBox);
    expect(preferencesCheckBox).not.toBeChecked();

    // Check `Allow users to advanced settings` check box
    const advSettingsCheckBox = checkboxes[1];
    expect(advSettingsCheckBox).toBeInTheDocument();
    expect(advSettingsCheckBox).toBeChecked();
    
    fireEvent.click(advSettingsCheckBox);
    expect(advSettingsCheckBox).not.toBeChecked();

    // Check `Allow users to advanced settings` check box
    const updateConfigCheckBox = checkboxes[2];
    expect(updateConfigCheckBox).toBeInTheDocument();
    expect(updateConfigCheckBox).toBeChecked();
    
    fireEvent.click(updateConfigCheckBox);
    expect(updateConfigCheckBox).not.toBeChecked();

     // interval for update config not enabled
     const intervalInputBox = queryByDisplayValue('24');
     expect(intervalInputBox).not.toBeEnabled();
  });

  it('Application more settings: test section Connectivity', async () => {
    const store = createStore(rootState);
    // Render
    const { queryByDisplayValue } = render(
      <Provider store={store}>
        <HomeScreenMoreSetting />
      </Provider>
    );

    // Change timeout
    const timeoutInputBox = queryByDisplayValue('180');
    fireEvent.change(timeoutInputBox, { target: { value: '240'} });
    const newTimeoutInputBox = queryByDisplayValue('240');
    expect(newTimeoutInputBox).toBeInTheDocument();
  });

  it('Application more settings: test section Logging', async () => {
    const store = createStore(rootState);
    // Render
    const { queryByDisplayValue, queryAllByRole,  getByTestId, getByText} = render(
      <Provider store={store}>
        <HomeScreenMoreSetting />
      </Provider>
    );

    // Change log size
    const sizeInputBox = queryByDisplayValue('500');
    fireEvent.change(sizeInputBox, { target: { value: '1000'} });
    const newSizeInputBox = queryByDisplayValue('1000');
    expect(newSizeInputBox).toBeInTheDocument();

    // change log level
    const buttons = queryAllByRole('button');
    const levelDropdown = buttons[0];
    expect(levelDropdown).toBeInTheDocument();

  });

  it('Application more settings: test section Cache', async () => {
    const store = createStore(rootState);
    // Render
    const { queryAllByRole } = render(
      <Provider store={store}>
        <HomeScreenMoreSetting />
      </Provider>
    );

    const checkboxes = queryAllByRole('checkbox');
    const cacheCheckBox = checkboxes[3];
    expect(cacheCheckBox).toBeInTheDocument();
    expect(cacheCheckBox).not.toBeChecked();
    
    fireEvent.click(cacheCheckBox);
    expect(cacheCheckBox).toBeChecked();
  });
});
