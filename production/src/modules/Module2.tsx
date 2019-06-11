import * as React from 'react'

declare var mstrmojo: any

export default class Module2 extends React.Component<any, any> {
  componentDidMount() {
    // Render mojo UI
    (new mstrmojo.MyButton({
      placeholder: 'mojo-target'
    })).render();
  }
  render() {
    return (
      // Add additional div container to avoid some dom removeChild exception.
      <div>
        <div id="mojo-target">
        </div>
      </div>
    )
  }
}
