import React, { Component } from 'react'
import D3Sunburst from './sunburst.js'

class Sunburst extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // D3 Code to create the chart
    this._chart = D3Sunburst.create(
      this._rootNode,
      this.props.data,
      this.props.config
    )
  }

  componentDidUpdate() {
    // D3 Code to update the chart
    // D3Sunburst.update(this._rootNode, this.props.data, this.props.config).apply(
    //   this
    // )
  }

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
