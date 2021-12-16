import { ColorPickerDropdown } from "@mstr/rc";
import { Input, Modal } from "antd";
import * as React from "react";
import { useState } from "react";
import {
    default as VC,
    localizedStrings,
  } from "../../../HomeScreenConfigConstant";
  const classNamePrefix = "home-screen-dossiersetting";
const colorPickerProps = {
    chosenTab: "grid",
    colorGuideHexVals: [
      '#DB6657',
      '#D76322',
      '#E69912',
      '#83C962',
      '#55BFC3',
      '#1C8DD4',
      '#4F60D6',
      '#834FBD',
      '#000000',
      '#35383A',
      '#6C6C6C',
      '#ABABAB',
      '#DEDEDE',
      '#EBEBEB',
      '#F4F4F4',
      '#FFFFFF'
    ],
    opacity: 100,
    useGradient: false,
    useOpacity: false,
    value: "#000000"
}
const ColorPaletteEditor: React.FC<any>  = (props: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
      };
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <>
        <span
            className={`${classNamePrefix}-custom-color-palette-new`}
            onClick={showModal}
          >
            <span
              tabIndex={0}
              aria-label={localizedStrings.NEW_COLOE_PALETTE}
              className={VC.FONT_ADD_NEW}
            />
            <span
              className={`${classNamePrefix}-custom-color-palette-new-text`}
            >
              {localizedStrings.NEW_COLOE_PALETTE}
            </span>
          </span>
        <Modal
          width='240px'
          destroyOnClose={true}
          visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
          >
          
          <div>Name</div>
          <Input placeholder="New " ></Input>
          <div>Palette</div> 
          <div>

          </div>
          <ColorPickerDropdown {...colorPickerProps}/>
        </Modal>
        </>
      )
}
export default ColorPaletteEditor;