import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Popover } from 'antd'
import Tooltip from '../../Tooltip'
import './styles.scss'

class TabTitle extends React.Component {
  render() {
    let { showTitle, title, iconClass, tableIconColor, enableActions, actionIcons } = this.props
    return (
      <div className='mstr-react-panel-tab-title'>
        {
          iconClass ? <div className={classnames('tab-icon left-icon', iconClass)} /> : null
        }
        {
          tableIconColor
            ? <div className='table-icon-wrapper left-icon'>
              <i className='table-icon-font' style={{ color: tableIconColor }}>&#xe805;</i>
            </div> : null
        }
        {
          showTitle
            ? <div className={'title-text-wrapper'}>
              <div className={'title-text'}>
                {title}
              </div>
            </div> : null
        }
        {(actionIcons && enableActions)
          ? actionIcons.map(
              ai =>
                (ai.actionType === 'popover'
                  ? <Popover
                    content={ai.content}
                    title={ai.title}
                    trigger='click'
                    key={ai.name}
                    >
                    <div
                      className={classnames('tab-icon', ai.iconClass)}
                      onClick={ai.action}
                      key={ai.name}
                      />
                  </Popover>
                  : <Tooltip text={ai.tooltip} key={ai.name}>
                    <div
                      className={classnames('tab-icon', ai.iconClass)}
                      onClick={ai.action}
                      key={ai.name}
                    />
                  </Tooltip>)
            )
          : null}
      </div>
    )
  }
}

TabTitle.propTypes = {
  showTitle: PropTypes.bool,
  title: PropTypes.string,
  iconClass: PropTypes.string,
  tableIconColor: PropTypes.string, // iconClass and tableIconColor, you should only specify one of them.
  actionIcons: PropTypes.array,
  enableActions: PropTypes.bool
}

TabTitle.defaultProps = {
  showTitle: true,
  actionIcons: []
}

export default TabTitle
