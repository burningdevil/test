import React from 'react'

import PropTypes from 'prop-types'
import classNames from 'classnames'

import './MyComponent.css'

class MyComponent extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool,
        onClick: PropTypes.func
    }

    static defaultProps = {
        isDisabled: false,
        onClick: () => {}
    }

    handleClick = () => {
        this.props.onClick();

    }

    render() {
        const {isDisabled, text} = this.props;
        let buttonStyle = classNames('btn', {
            'btn-disabled': isDisabled
        })

        return (
            <div>
                <h1>Hello from My Component</h1>
                <button onClick={this.handleClick} className={buttonStyle} disabled={isDisabled}>{text}</button>
            </div>
        )
    }
        
}

export default MyComponent
