jest.mock('../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import HomeScreenHomeSetting from '../views/HomeScreenHomeSetting';
import { mockLibraryAsHome, mockDossierAsHome } from './__mocks__/mock_state';


describe('HomeScreenHomeSetting Component', () => {
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

  it('Application homescreen settings: test library as home', async () => {
    const store = createStore(mockLibraryAsHome);
    // Render
    const { queryAllByRole, queryByText } = render(
      <Provider store={store}>
        <HomeScreenHomeSetting />
      </Provider>
    );
    // check library as home checked
    const checkboxes = queryAllByRole('radio');
    const libraryCheckBox = checkboxes[0];
    expect(libraryCheckBox).toBeInTheDocument();
    expect(libraryCheckBox).toBeChecked();

    // Check dossier as home unchecked
    const dossierCheckBox = checkboxes[1];
    expect(dossierCheckBox).toBeInTheDocument();
    expect(dossierCheckBox).not.toBeChecked();

    // check previewer
    const libraryPreview = queryByText('libraryWindow');
    expect(libraryPreview).toBeInTheDocument();

    const dossierPreview = queryByText('dossierWindow');
    expect(dossierPreview).toBeInTheDocument();
    
    fireEvent.click(dossierCheckBox);
    expect(dossierCheckBox).toBeChecked();
    expect(libraryCheckBox).not.toBeChecked();

    // check previewer
    const libraryNewPreview = queryByText('libraryWindow');
    expect(libraryNewPreview).not.toBeInTheDocument();

    const dossierNewPreview = queryByText('dossierWindowHome');
    expect(dossierNewPreview).toBeInTheDocument();
  });

  it('Application homescreen settings: test dossier as home', async () => {
    const store = createStore(mockDossierAsHome);
    // Render
    const { queryAllByRole, queryByText } = render(
      <Provider store={store}>
        <HomeScreenHomeSetting />
      </Provider>
    );
    // check library as home checked
    const checkboxes = queryAllByRole('radio');
    const libraryCheckBox = checkboxes[0];
    expect(libraryCheckBox).toBeInTheDocument();
    expect(libraryCheckBox).not.toBeChecked();

    // Check dossier as home unchecked
    const dossierCheckBox = checkboxes[1];
    expect(dossierCheckBox).toBeInTheDocument();
    expect(dossierCheckBox).toBeChecked();

    // check previewer
    const libraryNewPreview = queryByText('libraryWindow');
    expect(libraryNewPreview).not.toBeInTheDocument();

    const dossierNewPreview = queryByText('dossierWindowHome');
    expect(dossierNewPreview).toBeInTheDocument();
    
    fireEvent.click(libraryCheckBox);
    expect(dossierCheckBox).not.toBeChecked();
    expect(libraryCheckBox).toBeChecked();

    // check previewer
    const libraryPreview = queryByText('libraryWindow');
    expect(libraryPreview).toBeInTheDocument();

    const dossierPreview = queryByText('dossierWindow');
    expect(dossierPreview).toBeInTheDocument();
  });
});
