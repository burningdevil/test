import * as React from 'react';
import { render, cleanup, fireEvent, waitFor, screen, queryByLabelText, queryByText, queryAllByRole } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import { selectIsToolbarHidden, selectIsDossierAsHome, selectSelectedLibraryIcons, selectIsToolbarCollapsed } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import HomeScreenComponents from '../views/HomeScreenComponents';
import rootState, { mockLibraryAsHome } from './__mocks__/mock_state';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';

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
    expect(switches.length).toBe(7);  // 6 Icon switches for dossier as home
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
