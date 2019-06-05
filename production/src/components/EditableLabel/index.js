import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './styles.scss'

function EditableLabel({ handleBlur, style, value, className }) {
  let inputDiv = useRef(null)

  useEffect(() => {
    inputDiv.current.select()
  })

  return (
    <div className={classnames('editable-label editing', className)} style={style}>
      <input
        className='input'
        type='text'
        onBlur={handleBlur}
        defaultValue={value}
        ref={inputDiv}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            handleBlur(e)
          }
        }}
      />
    </div>
  )
}

EditableLabel.propTypes = {
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  handleBlur: PropTypes.func
}

EditableLabel.defaultProps = {
  style: {},
  className: '',
  handleBlur: () => {
  }
}

export default EditableLabel
