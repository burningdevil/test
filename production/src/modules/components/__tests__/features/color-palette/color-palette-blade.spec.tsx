jest.mock('../../../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, queryByAttribute } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../../../store/createStore';
import { mockLibraryAsHome, mockDossierAsHome, mockColorPalette } from '../../__mocks__/mock_state';
import ColorPaletteBlade from '../../../features/color-palette/color-palette-blade';


describe('ColorPaletteBlade Component', () => {
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

  it('ColorPaletteBlade: use custom palette', async () => {
    const store = createStore(mockColorPalette);
    // Render
    const { queryAllByRole, queryByText, container } = render(
      <Provider store={store}>
        <ColorPaletteBlade />
      </Provider>
    );
    // check default color palette checked
    const checkboxes = queryAllByRole('radio');
    const defaultCheckBox = checkboxes[0];
    expect(defaultCheckBox).toBeInTheDocument();
    expect(defaultCheckBox).not.toBeChecked();

    // Check custom palette
    const customCheckBox = checkboxes[1];
    expect(customCheckBox).toBeInTheDocument();
    expect(customCheckBox).toBeChecked();
    
    fireEvent.click(defaultCheckBox);
    expect(defaultCheckBox).toBeChecked();
    expect(customCheckBox).not.toBeChecked();

    fireEvent.click(customCheckBox);

    // check add button
    const paletteAddBtn = container.querySelector('.icon-pnl_add-new');
    expect(paletteAddBtn).not.toBeInTheDocument();
   
    // check the grid
    const paletteGrid = container.querySelector('#color-palette-grid-0');
    expect(paletteGrid).toBeInTheDocument();
    const rows = container.querySelectorAll('.ant-table-row');
    expect(rows?.length).toBe(1);

  });

});
