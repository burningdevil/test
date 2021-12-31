jest.mock('../../../../services/Api');

import * as React from 'react';
import { render, cleanup, fireEvent, queryByAttribute } from '@testing-library/react';
import { Provider } from 'react-redux';
import createStore from '../../../../store/createStore';
import { mockLibraryAsHome, mockDossierAsHome, mockColorPalette } from '../__mocks__/mock_state';
import ColorPaletteBlade from '../../features/color-palette/color-palette-blade';


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

  it('ColorPaletteBlade: use project level palette', async () => {
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
    expect(defaultCheckBox).toBeChecked();

    // Check custom palette
    const customCheckBox = checkboxes[1];
    expect(customCheckBox).toBeInTheDocument();
    expect(customCheckBox).not.toBeChecked();
    
    fireEvent.click(customCheckBox);
    expect(customCheckBox).toBeChecked();
    expect(defaultCheckBox).not.toBeChecked();

    // check add button
    const paletteAddBtn = container.querySelector('.icon-pnl_add-new');
    expect(paletteAddBtn).toBeInTheDocument();

    // check the default grid
    const defaultPaletteGrid = container.querySelector('#color-palette-grid-1');
    expect(defaultPaletteGrid).toBeInTheDocument();
    const rows = container.querySelectorAll('.ant-table-row');
    expect(rows?.length).toBe(1);

  });

});
