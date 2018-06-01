import React, { Component } from 'react'
import _ from 'lodash'
import * as d3 from 'd3'
import {
  schemeBlues,
  schemeCategory10,
  interpolateBlues,
} from 'd3-scale-chromatic'

import data from './data.json'

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.createSunburst = this.createSunburst.bind(this)
  }

  componentDidMount() {
    this.createSunburst()
  }

  componentDidUpdate() {
    this.createSunburst()
  }

  createSunburst() {
    const node = this.node
    // const data = this.props.data

    var width = this.props.size[0],
      height = this.props.size[1],
      radius = Math.min(width, height) / 2 - 10

    var formatNumber = d3.format(',d')

    var x = d3.scaleLinear().range([0, 2 * Math.PI])

    var y = d3.scaleSqrt().range([0, radius])

    const colorset = _.times(5, i => {
      return d3.color(d3.interpolateBlues(1 / i)).hex()
    })
    var color = d3.scaleOrdinal(colorset)

    var partition = d3.partition()

    var arc = d3
      .arc()
      .startAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x0)))
      })
      .endAngle(function(d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x1)))
      })
      .innerRadius(function(d) {
        return Math.max(0, y(d.y0))
      })
      .outerRadius(function(d) {
        return Math.max(0, y(d.y1))
      })

    var svg = d3
      .select(node)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    var root = d3.hierarchy(data)
    root.sum(function(d) {
      return d.size
    })

    svg
      .selectAll('path')
      .data(partition(root).descendants())
      .enter()
      .append('path')
      .attr('d', arc)
      .style('fill', function(d) {
        return color((d.children ? d : d.parent).data.name)
      })
      .on('click', click)
      .append('title')
      .text(function(d) {
        return d.data.name + '\n' + formatNumber(d.value)
      })

    function click(d) {
      svg
        .transition()
        .duration(750)
        .tween('scale', function() {
          var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius])
          return function(t) {
            x.domain(xd(t))
            y.domain(yd(t)).range(yr(t))
          }
        })
        .selectAll('path')
        .attrTween('d', function(d) {
          return function() {
            return arc(d)
          }
        })
    }

    d3.select(self.frameElement).style('height', height + 'px')
  }

  render() {
    return (
      <svg
        ref={node => (this.node = node)}
        width={this.props.size[0]}
        height={this.props.size[1]}
      />
    )
  }
}
export default BarChart
