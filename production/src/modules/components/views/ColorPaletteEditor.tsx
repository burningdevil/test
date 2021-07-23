import * as React from 'react'
import { ColorPickerDropdown } from '@mstr/rc'
import { Modal } from 'antd'

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

class ColorPaletteEditor extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }
    render() {
        return (
          <Modal
            visible={this.props.visible}
            width='240px'
            destroyOnClose={true}>
            <ColorPickerDropdown {...colorPickerProps}/>
          </Modal>
        )
    }
}

export default ColorPaletteEditor;