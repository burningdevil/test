import * as React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import HomeScreenConfigEditor from '../views/HomeScreenConfigEditor';
import rootState from './__mocks__/mock_state';

jest.mock('../../../services/Api');

describe('HomeScreenConfigEditor Component: render and interaction', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    it('HomeScreenConfigEditor: test new application editor', async () => {
        const store = createStore(rootState);
        // Render
        const { queryAllByRole, queryByText } = render(
            <Provider store={store}>
                <HomeScreenConfigEditor />
            </Provider>
        );
        // Check tabs and change selection
        const tabs = queryAllByRole('tab');
        expect(tabs.length).toBe(4);

        const generalTabView = queryByText('environment');
        expect(generalTabView).toBeInTheDocument();

        fireEvent.click(tabs[1]);
        const homeTabView = queryByText('selectHomeScreen');
        expect(homeTabView).toBeInTheDocument();

        fireEvent.click(tabs[2]);
        const componentsTabView = queryByText('enableFeatureTitle');
        expect(componentsTabView).toBeInTheDocument();

        // fireEvent.click(tabs[3]);
        // screen.debug(null, 10000000);
        // await screen.findByText('addContent');
        // const bundlesTabView = queryByText('addContent');
        // expect(bundlesTabView).toBeInTheDocument();

        // fireEvent.click(tabs[4]);
        // const moreSettingsTabView = queryByText('mobileOnlyDesc');
        // expect(moreSettingsTabView).toBeInTheDocument();

        // var buttons = queryAllByRole('button');
        // expect(buttons.length).toBe(3);
    });

    it('HomeScreenConfigEditor: test edit application editor', async () => {
        const store = createStore(rootState);
        const editorId = { search: 'id=B98E838240D2B2014F95FEA1E6001013' };
        // Render
        const { queryAllByRole, queryByText, queryByDisplayValue } = render(
            <Provider store={store}>
                <HomeScreenConfigEditor location={editorId} />
            </Provider>
        );

        const nameInputBox = queryByDisplayValue('test application');
        expect(nameInputBox).toBeInTheDocument();

        var buttons = queryAllByRole('button');
        expect(buttons.length).toBe(2);
    });
});
