import React, { Component } from 'react'
import { connect } from 'react-redux'
import D3Sunburst from './sunburst.js'

import * as actionCreators from '../../state/actions'

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

function mapStateToProps(state) {
  return { todos: state.items }
}

export default connect(mapStateToProps)(BarChart)
