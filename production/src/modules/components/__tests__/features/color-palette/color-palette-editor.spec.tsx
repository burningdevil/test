jest.mock('../../../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, queryByAttribute, waitFor, queryByRole } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../../../store/createStore';
import { mockColorPalette } from '../../__mocks__/mock_state';
import ColorPaletteEditor from '../../../features/color-palette/color-palette-editor/color-palette-editor';
import i18n from 'i18next'

describe('ColorPaletteModal Component', () => {
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

  it('ColorPaletteModal: default', async () => {
    const store = createStore(mockColorPalette);
    // Render
    const { queryAllByRole, queryByText, queryByPlaceholderText, container } = render(
      <Provider store={store}>
        <ColorPaletteEditor visible = {true} params = {{name: 'test', colors: ['666']}} close={() => {}}/>
      </Provider>
    );
    // check search
    const modalContainer = document.querySelector('.modal-content');
    const name = modalContainer.querySelector('.mstr-input >input')
    expect(name).toBeInTheDocument();
   
    // palette list
    const paletteList = modalContainer.querySelector('.modal-content-palette-list');
    const cells = paletteList.querySelectorAll('.color-cell');
    expect(cells.length).toBe(1);
    const addBtn = paletteList.querySelector('.add-button');
    fireEvent.click(addBtn);
    // will not add because of duplicate.
    await waitFor(() => {expect(modalContainer.querySelector('.modal-content-palette-list').querySelectorAll('.color-cell').length).toBe(1);});
    // add the essential one.
    const grids = modalContainer.querySelector('.color-grid');
    const essentials = grids.querySelectorAll('.color-cell');
    fireEvent.click(essentials[1]);
    fireEvent.click(addBtn);
    await waitFor(() => {expect(document.querySelector('.modal-content-palette-list').querySelectorAll('.color-cell').length).toBe(2);});
    for(let i=0; i< 14;i++){
        fireEvent.click(essentials[i + 5]);
        fireEvent.click(addBtn);
    }
    await waitFor(() => {expect(document.querySelector('.modal-content-palette-list').querySelectorAll('.color-cell').length).toBe(16);});
    await waitFor(() => {expect(document.querySelector('.modal-content-palette-list').querySelector('.add-button')).not.toBeInTheDocument();});
    // solid mode
    const switchBtn = modalContainer.querySelector('.palette-mode');
    fireEvent.click(switchBtn);
    const hexInput = modalContainer.querySelector('.hex-input').querySelector('input');
    expect(hexInput).toBeInTheDocument();
    fireEvent.change(hexInput, { target: { value: '123456'} });
    fireEvent.click(addBtn);
    await waitFor(() => {expect(modalContainer.querySelector('.rgba-input').querySelector('input').value).toBe('18');});

});

});
