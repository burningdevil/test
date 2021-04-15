import * as React from 'react'
import '../scss/HomeScreenDossierPicker.scss'

export default class HomeScreenDossierPicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = async () => {
    this.setState({
      objects: []
    })
  }

  render() {
    return (
      <div>
        <div>This is HomeScreenDossierPicker</div>
      </div>
    )
  }
}
