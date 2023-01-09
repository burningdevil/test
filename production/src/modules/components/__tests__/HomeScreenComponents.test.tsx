import * as React from 'react';
import { render, cleanup, fireEvent, waitFor, screen, queryByLabelText, queryByText, queryAllByRole } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import { selectIsToolbarHidden, selectIsDossierAsHome, selectSelectedLibraryIcons, selectIsToolbarCollapsed } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import HomeScreenComponents from '../views/HomeScreenComponents';
import rootState, { mockLibraryAsHome } from './__mocks__/mock_state';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';

jest.mock('../../../services/Api');
describe('HomeScreenComponents Component', () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    });
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

  beforeEach(() => {
    
  });

  it('Static Render Test', () => {
    const store = createStore(mockLibraryAsHome);
    // Render
    const { queryByText, queryByLabelText } = render(
      <Provider store={store}>
        <HomeScreenComponents />
      </Provider>
    );

    // Library As Home
    expect(selectIsDossierAsHome(store.getState() as RootState)).toBe(false);

    // Collapse Toolbar
    const collapseToolbarCheckBox = queryByLabelText('collapseToolbar');
    expect(collapseToolbarCheckBox).toBeInTheDocument();
    expect(collapseToolbarCheckBox).not.toBeChecked();
    fireEvent.click(collapseToolbarCheckBox);
    expect(selectIsToolbarCollapsed(store.getState() as RootState)).toBe(true);
  });

  it('CheckBox and Switch Render Test', async () => {
    const store = createStore(rootState);
    // Render
    const { queryByLabelText, queryAllByRole } = render(
      <Provider store={store}>
        <HomeScreenComponents />
      </Provider>
    );
 
    // Disable Toolbar CheckBox
    const disableToolbarCheckBox = queryByLabelText('disableToolbar');
    expect(disableToolbarCheckBox).toBeInTheDocument();
    expect(disableToolbarCheckBox).not.toBeChecked();
    expect(selectIsToolbarHidden(store.getState() as RootState)).toBe(false);
    
    // Click event should not change the check state
    fireEvent.click(disableToolbarCheckBox);
    expect(disableToolbarCheckBox).toBeChecked();
    expect(selectIsToolbarHidden(store.getState() as RootState)).toBe(true);

    // Check Toolbar Icon status after toolbar disabled
    const switches = queryAllByRole('switch');
    expect(switches.length).toBe(11);  // 10 Icon switches for dossier as home
    expect(switches[1]).toBeChecked();
    expect(switches[1]).toBeDisabled(); // Because toolbar is disabled in preview actions

    // Restore toolabr setting
    fireEvent.click(disableToolbarCheckBox);
    expect(disableToolbarCheckBox).not.toBeChecked();

    // Test Icon switch
    await waitFor(() => {expect(switches[1]).not.toBeDisabled();});
    fireEvent.click(switches[1]);
    await waitFor(() => {expect(switches[1]).not.toBeChecked();});
  });
});
