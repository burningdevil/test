jest.mock('../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import HomeScreenConfigMainView from '../views/HomeScreenConfigMainView';
import rootState from './__mocks__/mock_state';

describe('HomeScreenConfigMainView Component', () => {
  beforeAll(() => {
    Object.defineProperty(window, "workstation", {
      value: {
        environments: {
          getCurrentEnvironment: jest.fn().mockImplementation(async () => {
              return {
                id: 4,
                name: 'Test Environment',
                status: 2,
                subType: -1,
                url: 'https://10.23.2.141:32880/web-dossier/',
                webVersion: '20.0.0000.0000J',
                projects: [
                  {
                    id: '6A255B7411E9EFB63EFE0080EFB5EF05',
                    name: 'Platform Analytics',
                    type: 32,
                    subType: 8192,
                    privileges: [182, 183, 165, 169, 171, 48, 54, 144, 143, 58],
                  },
                ]
              }
            }),
            onEnvironmentChange: jest
              .fn()
              .mockImplementation((callback) => callback()),
            offEnvironmentChange: jest.fn(),
        },
        dialogs: {
          openObjectEditor: jest.fn(),
          error: jest.fn()
        },
        window: {
          addHandler: jest.fn(),
          close: jest.fn().mockImplementation(),
          getExtraContext: jest.fn().mockImplementation(() => {
              return '[{}]'
            }),
        },
        utils: {
          getHelpBaseUrl: jest
            .fn()
            .mockImplementation(
              async () =>
                'https://www2.microstrategy.com/producthelp/2019/Workstation/WebHelp/Lang_1033/Content/'
            ),
          addHandler: jest
            .fn()
            .mockImplementation()
        },
      }
    });
});
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('Main Viewer Render', () => {
    const store = createStore(rootState);
    // Render
    const { queryByText, queryByLabelText } = render(
      <Provider store={store}>
        <HomeScreenConfigMainView />
      </Provider>
    );
    // New Application Button
    const newApplicationText = queryByText('newApplication');
    expect(newApplicationText).toBeInTheDocument();

    const newApplicationButton = queryByLabelText('newApplicationBtn');
    expect(newApplicationButton).toBeInTheDocument();
  });
});
