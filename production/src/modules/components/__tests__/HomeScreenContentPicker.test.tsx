jest.mock('../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
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
    const { queryAllByRole, queryByText, getByText } = render(
      <Provider store={store}>
        <ContentBundleContentPicker visible={true}/>
      </Provider>
    );
    
    // check rendering
    const dossiersTab = queryByText('dossiers');
    expect(dossiersTab).toBeInTheDocument();

    const documentsTab = queryByText('documents');
    expect(documentsTab).toBeInTheDocument();

    // const dossierItem = getByText('Customer Income Analysis2');
    // expect(dossierItem).toBeInTheDocument();
    
    // // check tab switch
    // const menus = queryAllByRole('menuitem');
    // expect(menus.length).toBe(2);

    // const documentsMenu = menus[1];
    // fireEvent.click(documentsMenu);

    // const documentItem = getByText('Colorful');
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
