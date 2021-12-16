import * as React from "react";
import {
  default as VC,
  localizedStrings,
} from "../../HomeScreenConfigConstant";
import { Checkbox, Divider, Radio, Space } from "antd";
import { Tooltip } from "@mstr/rc";
import PaletteGridView from "./palette-grid-view/palette-grid-view";
import { useState, useEffect } from "react";
import "./color-palette.scss";
import * as api from "../../../../services/Api";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { selectAllColorPalettes } from "../../../../store/selectors/HomeScreenConfigEditorSelector";
import { RootState } from "../../../../types/redux-state/HomeScreenConfigState";
import ColorPaletteEditor from "./color-palette-editor.tsx/color-palette-editor";
const classNamePrefix = "home-screen-dossiersetting";

const mapState = (state: RootState) => ({
  paletteList: selectAllColorPalettes(state),
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

const ColorPaletteBlade: React.FC<PropsFromRedux & any> = () => {
  const paletteList = useSelector(selectAllColorPalettes);
  const [isProjectPalettes, setProjectPalettes] = useState(true);
  const [showColorPaletteEditor, openColorPaletteEditor] = useState(false);
  const [currentColorPaletteId, SetCurrentColorPaletteId] = useState(undefined);

  useEffect(() => {
    api.loadColorPaletteList();
  }, []);

  const handleAddColorPalette = () => {
    openColorPaletteEditor(true);
  };
  return (
    <div className={`${classNamePrefix}-container`}>
      <div className={`${classNamePrefix}-title`}>
        {localizedStrings.COLOR_PALETTE}
      </div>
      {/* Default Color Palette Section*/}
      <div className={`${classNamePrefix}-default-color-palette-container`}>
        <Radio.Group
          onChange={(e) => {
            setProjectPalettes(e.target.value);
          }}
          value={isProjectPalettes}
        >
          <Space direction="vertical">
            <Radio value={true}>
              {localizedStrings.ENABLE_MICORSTRATEGY_COLOR_PALETTE_DESC}
            </Radio>
            <Radio value={false}>
              {localizedStrings.ENABLE_MICORSTRATEGY_COLOR_PALETTE_DESC}
              <Tooltip
                title={
                  localizedStrings.ENABLE_MICORSTRATEGY_COLOR_PALETTE_TOOLTIP
                }
                placement="right"
              >
                <span className={VC.FONT_MSG_INFO}> </span>
              </Tooltip>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      <Divider />

      {/* Custom Color Palette section */}
      <div className={`${classNamePrefix}-custom-color-palette-container`}>
        <div
          className={`${classNamePrefix}-custom-color-palette-title-section`}
        >
          <span className={`${classNamePrefix}-custom-color-palette-title`}>
            {localizedStrings.CUSTOM_COLOR_PALETTE_TITLE}
          </span>
          <ColorPaletteEditor visible={showColorPaletteEditor} colorPaletteId={currentColorPaletteId}/>
        </div>
        {/* Custom Color Palette List */}
        {paletteList?.length > 0 && <PaletteGridView paletteType={2} />}
        <div
          className={`${classNamePrefix}-custom-color-palette-title-section`}
        >
          <span className={`${classNamePrefix}-custom-color-palette-title`}>
            {localizedStrings.CUSTOM_COLOR_PALETTE_TITLE}
          </span>
        </div>
        {/* Default Color Palette List */}
        {paletteList?.length > 0 && <PaletteGridView paletteType={1} />}
      </div>
    </div>
  );
};

export default ColorPaletteBlade;
