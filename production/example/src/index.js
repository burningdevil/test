import React from 'react'
import { render} from 'react-dom'
import { MyComponent } from '../../src'

const showAlert = () => {
    return alert("Button is clicked")
}

const App = () => (
    <MyComponent text='My Button' onClick={showAlert} isDisabled={false}/> 
)

render(<App />, document.getElementById("root"))
