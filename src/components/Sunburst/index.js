import React, { Component } from 'react'
import D3Sunburst from './sunburst.js'

class Sunburst extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: {},
    }
  }

  componentDidMount() {
    // D3 Code to create the chart
    let chart = D3Sunburst.create(
      this._rootNode,
      this.props.data,
      this.props.config
    )
    this.setState({ chart: chart })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.config.mode !== this.props.config.mode
  }

  componentDidUpdate(props) {
    this._rootNode.innerHTML = ''
    D3Sunburst.create.call(
      this,
      this._rootNode,
      this.props.data,
      this.props.config
    )
  }

  will

  componentWillUnmount() {
    D3Sunburst.destroy(this._rootNode)
  }

  _setRef(componentNode) {
    this._rootNode = componentNode
  }

  render() {
    return <div ref={this._setRef.bind(this)} />
  }
}

export default Sunburst
