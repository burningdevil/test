jest.mock('../../../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, queryByAttribute, waitFor, queryByRole } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../../../store/createStore';
import { mockColorPalette } from '../../__mocks__/mock_state';
import ColorPaletteModal from '../../../features/color-palette/custom-palette-modal/custom-palette-modal';
import CustomPaletteModalGrid from '../../../features/color-palette/custom-palette-modal/custom-palette-modal-grid/custom-palette-modal-grid';


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
        <ColorPaletteModal visible = {true} close={() => {}}/>
      </Provider>
    );
    // check search
    debugger;
    const modalContainer = document.querySelector('.custom-palette-modal');
    const search = modalContainer.querySelector('.mstr-input')
    fireEvent.change(search, { target: { value: 'xxx'} });
    await waitFor(() => {expect(modalContainer.querySelectorAll('.ant-table-row').length).toBe(2);});
   
    // Clear search
    const clearBtn = modalContainer.querySelector('.mstr-filter-search-input-btn');
    fireEvent.click(clearBtn);
    await waitFor(() => {expect(modalContainer.querySelectorAll('.ant-table-row').length).toBe(3);});

    const checkBoxes = queryAllByRole('checkbox');
    
    fireEvent.click(checkBoxes[1]);
    expect(checkBoxes[1]).toBeChecked();
    

  });

});
