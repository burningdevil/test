import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Select as SelectAntD } from 'antd'

import './style.scss'

export default class Select extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      selectedValue: props.value === '' ? undefined : props.value
    }
    this.handleSelectionChange = this.handleSelectionChange.bind(this)
  }

  handleSelectionChange(v) {
    if (v !== '') {
      if (v !== this.props.value) {
        this.props.onChange(v)
      }
      this.setState({ selectedValue: v })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ selectedValue: nextProps.value === '' ? undefined : nextProps.value })
    }
  }

  render () {
    let { style, datasource, className, placeholder, showSearch, hasGroups, mode, disabled, pulldownClassName } = this.props

    let generateOpts = function(items) {
      return items.map(item => {
        return (<SelectAntD.Option value={item.value} key={item.value} title={item.text} disabled={!!item.disabled} className={item.cls}>
          {item.prefix}{item.text}
        </SelectAntD.Option>)
      })
    }
    return (
      <SelectAntD
        style={style}
        mode={mode}
        showSearch={showSearch}
        notFoundContent={''}
        className={classnames(className, 'mstr-react-select', {
          showSearchIcon: (this.state.selectedValue === undefined || this.props.mode === 'multiple') && !this.state.searchPattern
        })}
        placeholder={placeholder}
        optionFilterProp='children'
        onSelect={this.handleSelectionChange}
        onBlur={(v) => {
          this.handleSelectionChange(v)
          this.setState({ searchPattern: '' })
        }}
        onChange={this.handleSelectionChange}
        onSearch={(v) => {
          this.setState({ searchPattern: v })
        }}
        value={this.state.selectedValue}
        dropdownClassName={classnames(pulldownClassName, 'mstr-react-select-dropdown')}
        disabled={disabled}
        suffixIcon={<div className='mstr-select-arrow' />}
        filterOption={(input, option) => {
          return option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }}>
        {
          hasGroups ? datasource.map(group => {
            return (<SelectAntD.OptGroup label={group.title} key={group.category}>
              {
                generateOpts(group.items)
              }
            </SelectAntD.OptGroup>)
          }) : generateOpts(datasource)
        }
      </SelectAntD>
    )
  }
}

Select.propTypes = {
  pulldownClassName: PropTypes.string,
  datasource: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  showSearch: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number
  ]),
  hasGroups: PropTypes.bool,
  mode: PropTypes.string
}
Select.defaultProps = {
  className: '',
  showSearch: true,
  placeholder: '',
  value: undefined,
  hasGroups: false,
  mode: ''
}
