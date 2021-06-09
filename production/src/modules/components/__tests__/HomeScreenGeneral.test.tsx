import * as React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import * as ActionsCreateor from '../../../store/actions/ActionsCreator';
import HomeScreenGeneral from '../views/HomeScreenGeneral';
import rootState from '../__tests__/__mocks__/mock_state';


describe('HomeScreenGeneral Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('Application name & description should be rendered', () => {
    const store = createStore(rootState);
    store.dispatch(ActionsCreateor.updateCurrentConfig({name: 'new application name'}));
    // Then
    const { queryByLabelText, queryByDisplayValue } = render(
      <Provider store={store}>
        <HomeScreenGeneral />
      </Provider>
    );
    // Then
    const nameInputBox = queryByDisplayValue('new application name');
    expect(nameInputBox).toBeInTheDocument();

    const desInputBox = queryByDisplayValue('this is test application description');
    expect(desInputBox).toBeInTheDocument();
  });

  it('Application platform check box click test', () => {
    const store = createStore(rootState);
    // Then
    const { queryByLabelText, queryByDisplayValue } = render(
      <Provider store={store}>
        <HomeScreenGeneral />
      </Provider>
    );
    // Then
    const mobileCheckBox = queryByLabelText('web');
    
    expect(mobileCheckBox).toBeInTheDocument();
    expect(mobileCheckBox).toBeChecked();
    
    fireEvent.click(mobileCheckBox);

    waitFor(() => expect(mobileCheckBox).not.toBeChecked());
  });
});
