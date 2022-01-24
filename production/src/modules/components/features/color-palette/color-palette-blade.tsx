import * as React from 'react';
import {
  default as VC,
  localizedStrings,
} from '../../HomeScreenConfigConstant';
import { Checkbox, Radio, Space } from 'antd';
import { Tooltip } from '@mstr/rc';
import PaletteGridView from './palette-grid-view/palette-grid-view';
import { useState, useEffect } from 'react';
import './color-palette.scss';
import * as api from '../../../../services/Api';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllColorPalettes,
  selectApplicationDefaultPalette,
  selectApplicationPalettes,
  selectUseConfigPalettes,
} from '../../../../store/selectors/HomeScreenConfigEditorSelector';
import { RootState } from '../../../../types/redux-state/HomeScreenConfigState';
import { useRef } from 'react';
import * as Actions from '../../../../store/actions/ActionsCreator';
import CustomPaletteModal from './custom-palette-modal/custom-palette-modal';
import { getSupportSingleColorPalette } from './color-palette.util';
const classNamePrefix = 'home-screen-dossiersetting';

const ColorPaletteBlade: React.FC<any> = () => {
  const paletteList = useSelector(selectAllColorPalettes);
  const useConfigPalettes = useSelector(selectUseConfigPalettes) ?? false;
  const applicationDefaultPalette = useSelector(
    selectApplicationDefaultPalette
  );
  const applicationPalettes = useSelector(selectApplicationPalettes);
  const [isProjectPalettes, setProjectPalettes] = useState(useConfigPalettes);
  const [showColorPaletteEditor, openColorPaletteEditor] = useState(false);
  const [currentColorPaletteId, SetCurrentColorPaletteId] = useState(undefined);
  const [isCustomPaletteCollapse, setCustomPaletteCollapse] = useState(false);
  const [isDefaultPaletteCollapse, setDefaultPaletteCollapse] = useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const dispatch = useDispatch();
  const childRef = useRef(null);
  useEffect(() => {
    isProjectPalettes && api.loadColorPaletteList();
  }, [isProjectPalettes]);

  const handleAddColorPalette = () => {
    openColorPaletteEditor(true);
  };
  const onCheckChangeUseProject = (e: any, dispatch: any) => {
    setProjectPalettes(e.target.value);
    dispatch(
      Actions.updateCurrentConfig({
        useConfigPalettes: e.target.value,
      })
    );
  };
  return (
    <div id="color-palette-setting" className={`${classNamePrefix}-container`}>
      <div className={`${classNamePrefix}-title`}>
        {localizedStrings.COLOR_PALETTE}
      </div>
      {/* Default Color Palette Section*/}
      <div className={`${classNamePrefix}-default-color-palette-container`}>
        <Radio.Group
          onChange={(e) => onCheckChangeUseProject(e, dispatch)}
          value={isProjectPalettes}
          size="small"
        >
          <Space direction='vertical'>
            <Radio value={false}>
              {localizedStrings.USE_PREVIOUS_COLOR_PALETTE_DESC}
            </Radio>
            <Radio value={true}>
              {localizedStrings.USE_NEW_COLOR_PALETTE_DESC}
              <Tooltip
                title={
                  localizedStrings.ENABLE_MICORSTRATEGY_COLOR_PALETTE_TOOLTIP
                }
                placement='right'
              >
                <span className={VC.FONT_MSG_INFO}> </span>
              </Tooltip>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Custom Color Palette section */}
      {isProjectPalettes && (
        <div className={`${classNamePrefix}-custom-color-palette-container`}>
          <div
            className={`${classNamePrefix}-custom-color-palette-title-section`}
          >
            <span className={`${classNamePrefix}-custom-color-palette-title`}>
              {localizedStrings.CUSTOM_COLOR_PALETTE_TITLE}
            </span>
            {applicationPalettes?.length > 0 && <span
              className={`${classNamePrefix}-custom-color-palette-new`}
              onClick={handleAddColorPalette}
            >
              
              <span
                className={`${classNamePrefix}-custom-color-palette-new-text`}
              >
                {localizedStrings.EDIT}
              </span>
            </span>}
            
          </div>
          {
            !applicationPalettes?.length && <div style ={{marginTop: '20px'}}>
            <span
              className={`${classNamePrefix}-custom-color-palette-new`}
              onClick={handleAddColorPalette}
            >
              <span
                tabIndex={0}
                aria-label={localizedStrings.NEW_COLOE_PALETTE}
                className={VC.FONT_ADD_NEW}
              />
              <span
                className={`${classNamePrefix}-custom-color-palette-new-text`}
              >{localizedStrings.NEW_COLOE_PALETTE}</span>
            </span>
          </div>
          }
          
          {/* Custom Color Palette List */}
          {applicationPalettes?.length > 0 && (
            <PaletteGridView
              paletteType={0}
              classNamePrefix='home-dossier-setting-grid-custom'
            />
          )}
          {
              <CustomPaletteModal
                visible={showColorPaletteEditor}
                close={openColorPaletteEditor}
              ></CustomPaletteModal>
            }
          
        </div>
      )}
      
    </div>
  );
};

export default ColorPaletteBlade;
