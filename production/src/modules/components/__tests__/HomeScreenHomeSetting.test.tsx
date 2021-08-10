jest.mock('../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../store/createStore';
import HomeScreenHomeSetting from '../views/HomeScreenHomeSetting';
import { mockLibraryAsHome, mockDossierAsHome } from './__mocks__/mock_state';


describe('HomeScreenHomeSetting Component', () => {
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
