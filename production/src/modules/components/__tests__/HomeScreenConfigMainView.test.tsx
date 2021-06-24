jest.mock('../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import HomeScreenConfigMainView from '../views/HomeScreenConfigMainView';
import rootState from './__mocks__/mock_state';

describe('HomeScreenConfigMainView Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('New Application button', () => {
    const store = createStore(rootState);
    // Then
    const { queryByText, queryByLabelText } = render(
      <Provider store={store}>
        <HomeScreenConfigMainView />
      </Provider>
    );
    // Then
    const newApplicationText = queryByText('newApplication');
    expect(newApplicationText).toBeInTheDocument();

    const newApplicationButton = queryByLabelText('newApplicationBtn');
    expect(newApplicationButton).toBeInTheDocument();
  });
});
