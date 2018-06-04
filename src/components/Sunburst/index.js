import React, { Component } from 'react'
import D3Sunburst from './sunburst.js'

class BarChart extends Component {
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
    D3Sunburst.update(this._rootNode, this.props.data, this.props.config)
  }

  componentWillUnmount() {
    D3Sunburst.destroy(this._rootNode)
  }

  _setRef(componentNode) {
    this._rootNode = componentNode
  }

  render() {
    return <div id="vizContainer" ref={this._setRef.bind(this)} />
  }
}
export default BarChart
