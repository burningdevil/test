import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Collapse as CollapseAntD } from 'antd'
import './styles.scss'
const Panel = CollapseAntD.Panel

function CollapseHeader({ header }) {
  return <div className='mstr-collapse-header-title' title={header}>
    {header}
  </div>
}
function Collapse({ className, isExpanded, header, disabled, children, ...rest }) {
  const PANEL_KEY = 'PANEL_KEY'
  const NONE = 0
  return (
    <CollapseAntD className={classnames('mstr-collapse', className)} bordered={false} defaultActiveKey={isExpanded ? PANEL_KEY : NONE}
      expandIcon={() => <div className='mstr-arrow'><div className='mstr-collapse-arrow' /></div>} {...rest} >
      <Panel className='mstr-collapse-panel' header={<CollapseHeader header={header} />} key={PANEL_KEY} disabled={disabled} title={header}>
        { children }
      </Panel>
    </CollapseAntD>
  )
}

Collapse.propTypes = {
  isExpanded: PropTypes.bool,
  disabled: PropTypes.bool,
  header: PropTypes.string,
  className: PropTypes.string
}

Collapse.defaultProps = {
  className: '',
  disabled: false,
  header: '',
  isExpanded: true
}

export default Collapse
