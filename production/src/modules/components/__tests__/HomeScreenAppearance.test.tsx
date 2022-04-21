import * as React from 'react';
import { render, cleanup, fireEvent, waitFor, screen, queryByLabelText, queryByText, queryAllByRole } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import { selectCurrentConfigTheme } from '../../../store/selectors/HomeScreenConfigEditorSelector';
import HomeScreenAppearance from '../views/HomeScreenAppearance';
import rootState from './__mocks__/mock_state';
import { RootState } from '../../../types/redux-state/HomeScreenConfigState';

jest.mock('../../../services/Api');
describe('HomeScreenAppearance Component', () => {
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

  it('Theme exists Test', () => {

    const  expectedTheme = {
      schemaVersion: 1,
      logos: {
        web: {
          type: 'URL',
          value: 'http://www.imageRepo.com/webImage.png'
        },
        favicon: {
          type: 'URL',
          value: 'http://www.imageRepo.com/faviconImage.png'
        },
        mobile: {
          type: 'URL',
          value: 'http://www.imageRepo.com/mobileImage.png'
        }
      }
    }

    const newRootState = { ...rootState };
    newRootState.configEditor.currentConfig.homeScreen.theme = expectedTheme

    const store = createStore(newRootState);
    // Render
    const { queryByText, queryByLabelText } = render(
      <Provider store={store}>
        <HomeScreenAppearance />
      </Provider>
    );

    // Check theme
    expect(selectCurrentConfigTheme(store.getState() as RootState)).toEqual(expectedTheme);
  });

  it('No Theme Test', async () => {
    const newRootState = { ...rootState };
    newRootState.configEditor.currentConfig.homeScreen.theme = undefined

    const store = createStore(newRootState);
    // Render
    const { queryByLabelText, queryAllByRole } = render(
      <Provider store={store}>
        <HomeScreenAppearance />
      </Provider>
    );
 
    // Disable Toolbar CheckBox
    expect(selectCurrentConfigTheme(store.getState() as RootState)).toEqual(undefined);
  });
});
