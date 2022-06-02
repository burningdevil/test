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
    Object.defineProperty(window, "workstation", {
      value: {
        environments: {
          getCurrentEnvironment: jest.fn()
        },
        dialogs: {
          openObjectEditor: jest.fn(),
          error: jest.fn()
        },
        window: {
          addHandler: jest.fn()
        }
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  beforeEach(() => {
    
  });

  it('Theme exists Test', async () => {

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
    await waitFor(() => {
      expect(selectCurrentConfigTheme(store.getState() as RootState)).toEqual(expectedTheme);
    });
  });

});
