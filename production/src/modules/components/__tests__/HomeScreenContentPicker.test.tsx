jest.mock('../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, screen, queryByRole, queryAllByRole, getByDisplayValue } from '@testing-library/react';
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
    const { queryByText, queryByDisplayValue } = render(
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

    // Dossier
    // const dossiers = queryAllByRole(itemListRowGroups[1], 'row'); // Query items from data list
    // expect(dossiers.length).toBe(3);
    // const dossierItem = queryByDisplayValue('Customer Income Analysis2');
    // expect(dossierItem).toBeInTheDocument();
    
    // check tab switch
    const dossiersTab = queryByText('dossiers');
    expect(dossiersTab).toBeInTheDocument();

    const documentsTab = queryByText('documents');
    expect(documentsTab).toBeInTheDocument();

    const menus = queryAllByRole(document.body, 'menuitem');
    expect(menus.length).toBe(2);

    // const documentsMenu = menus[1];
    // fireEvent.click(documentsMenu);

    // const documentItem = queryByDisplayValue('Colorful');
    // expect(documentItem).toBeInTheDocument();

    // check selection
    
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
