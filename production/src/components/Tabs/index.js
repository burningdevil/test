import React from 'react'

import { Tabs as TabsAntD } from 'antd'
import TabPane from './TabPane'

import './style.scss'

export default class Tabs extends React.Component {

  render() {
    return (
      <div className={this.props.collapseInactiveTabTitle ? 'mstr-card-tabs collapse-inactive-tab-title' : 'mstr-card-tabs'}>
        <TabsAntD type='card' {...this.props} >
          {this.props.children}
        </TabsAntD>
      </div>
    )
  }
}

Tabs.defaultProps = {
  collapseInactiveTabTitle: true
}
Tabs.TabPane = TabPane
