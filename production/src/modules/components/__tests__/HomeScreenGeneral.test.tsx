import * as React from 'react';
import { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import * as ActionsCreateor from '../../../store/actions/ActionsCreator';
import HomeScreenGeneral from '../views/HomeScreenGeneral';
import rootState from '../__tests__/__mocks__/mock_state';


describe('HomeScreenGeneral Component', () => {
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

  it('Application name & description should be rendered', async () => {
    const store = createStore(rootState);
    // Render
    const { queryByDisplayValue } = render(
      <Provider store={store}>
        <HomeScreenGeneral />
      </Provider>
    );
    // Change Name with redux action
    store.dispatch(ActionsCreateor.updateCurrentConfig({name: 'new application name'}));
    await screen.findByDisplayValue('new application name');

    // Change Name
    const nameInputBox = queryByDisplayValue('new application name');
    fireEvent.change(nameInputBox, { target: { value: 'new application name after change event'} });
    const newNameInputBox = queryByDisplayValue('new application name after change event');
    expect(newNameInputBox).toBeInTheDocument();

    // Change Desc
    const descInputBox = queryByDisplayValue('this is test application description');
    fireEvent.change(descInputBox, { target: { value: 'new application desc after change event'} });
    const newDescInputBox = queryByDisplayValue('new application desc after change event');
    expect(newDescInputBox).toBeInTheDocument();
  });

  // it('Application platform check box click test', async () => {
  //   const store = createStore(rootState);
  //   // Render
  //   const { queryByLabelText } = render(
  //     <Provider store={store}>
  //       <HomeScreenGeneral />
  //     </Provider>
  //   );
  //   // Check `Web` check box
  //   const webCheckBox = queryByLabelText('web');
  //   expect(webCheckBox).toBeInTheDocument();
  //   expect(webCheckBox).toBeChecked();
    
  //   // CheckBox is disabled. Click event should not change the check state
  //   fireEvent.click(webCheckBox);
  //   expect(webCheckBox).not.toBeChecked();
  // });

  it('Application Name Limitation test', async () => {
    const store = createStore(rootState);
    // Render
    const { queryByDisplayValue, queryByText, container } = render(
      <Provider store={store}>
        <HomeScreenGeneral />
      </Provider>
    );
    // Change Name length to 0, display error info
    const nameInputBox = queryByDisplayValue('test application');
    fireEvent.change(nameInputBox, { target: { value: ''} });
    await waitFor(() => {
       const errorContainer = container.querySelector('.home-screen-general-name-error');
       expect(errorContainer).toBeInTheDocument()
    });

    // Change Name, dismiss error info
    fireEvent.change(nameInputBox, { target: { value: 'new application'} });
    await waitFor(() => {
      const errorContainer = container.querySelector('.home-screen-general-name-error');
      expect(errorContainer).not.toBeInTheDocument()
   });
  });
});
