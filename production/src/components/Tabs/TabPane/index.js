import React from 'react'

import classnames from 'classnames'
import { Tabs } from 'antd'

const TabPaneAntD = Tabs.TabPane

export default class TabPane extends React.Component {

  render() {
    return (
      <TabPaneAntD className='mstr-as-tab-pane' {...this.props} >
        {this.props.children}
      </TabPaneAntD>
    )
  }
}

TabPane.EmptyContent = ({ className = '', title = '', text = '', actions = null }) => {
  return (<div className={classnames('empty-content', className)}>
    <div className='empty-title'>{title}</div>
    <div className='empty-text'>{text}</div>
    {
      actions
    }
  </div>)
}
