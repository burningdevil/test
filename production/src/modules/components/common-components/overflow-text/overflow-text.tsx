
import * as React from 'react';

import './overflow-text.scss'

import { Tooltip } from '@mstr/rc';
const classNamePrefix = 'overflow-text';
/**
 * This component can be used to display the text with overflow.
 * @param props {text: string}
 * @returns 
 */
const OverflowText: React.FC<any> = (props: any) => {
    const {text} = props;
    const [showTooltip, setShowTooltip] = React.useState(false);
    const handleTooltip = (event: any) => {
        if(event.target?.offsetWidth < event.target?.scrollWidth){
            setShowTooltip(true);
        }else {
            setShowTooltip(false);
        }
      }
      const hideTooltip = () => {
        setShowTooltip(false);
      }
    return (
        <Tooltip
                      title={<span>{text}</span>}
                      placement='bottom'
                      visible = {showTooltip}
                      triggerMode='hover'>
                        <span onMouseEnter={handleTooltip} onMouseLeave={hideTooltip} className = {`${classNamePrefix}-desc ml8 mt6 overflow`}>
                          {text}
                        </span>
        </Tooltip>
    );
};

export default OverflowText;