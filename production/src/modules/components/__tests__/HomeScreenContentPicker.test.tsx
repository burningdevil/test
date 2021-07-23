jest.mock('../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, screen, queryByRole, queryAllByRole, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import ContentBundleContentPicker from '../views/ContentBundleContentPicker';
import { mockDossierPicker } from './__mocks__/mock_state';


describe('ContentBundleContentPicker Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('Application homescreen settings: test dossier/document picker, rendering', async () => {
    const store = createStore(mockDossierPicker);
    // Render
    const { queryByText, queryByPlaceholderText } = render(
      <Provider store={store}>
        <ContentBundleContentPicker visible={true}/>
      </Provider>
    );
    // check rendering
    const dossierItemGrid = queryByRole(document.body, 'grid');
    expect(dossierItemGrid).toBeInTheDocument();

    // List
    const itemListRowGroups = queryAllByRole(dossierItemGrid, 'rowgroup');
    expect(itemListRowGroups.length).toBe(2); // Header and Data List

    await waitFor(() => {expect(queryAllByRole(itemListRowGroups[1], 'row').length).toBe(3);});
    // Dossier
    const dossierItemOwner = queryByText('Administrator');
    expect(dossierItemOwner).toBeInTheDocument();
    
    // check tab switch
    const menus = queryAllByRole(document.body, 'menuitem');
    expect(menus.length).toBe(2);
    const documentsMenu = menus[1];
    fireEvent.click(documentsMenu);
    // wait after tab change
    await waitFor(() => {expect(queryAllByRole(itemListRowGroups[1], 'row').length).toBe(2);});

    const documentItemOwner = queryByText('Lucy');
    expect(documentItemOwner).toBeInTheDocument();

    // check search
    const searchInput = queryByPlaceholderText('search');
    fireEvent.change(searchInput, { target: { value: 'Colorful'} });
    await waitFor(() => {expect(queryAllByRole(itemListRowGroups[1], 'row').length).toBe(1);});

    // Clear search
    const buttons = queryAllByRole(document.body, 'button');
    screen.debug(buttons[1]); // Second is the Search Input clear button
    fireEvent.click(buttons[1]);
    await waitFor(() => {expect(queryAllByRole(itemListRowGroups[1], 'row').length).toBe(2);});
    
  });

  it('Application homescreen settings: test dossier/document picker, search', async () => {
    const store = createStore(mockDossierPicker);
    // Render
    const { queryAllByRole, queryByText } = render(
      <Provider store={store}>
        <ContentBundleContentPicker />
      </Provider>
    );
    
  });
});
