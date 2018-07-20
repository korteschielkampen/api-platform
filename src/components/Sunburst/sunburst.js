import React, { Component } from 'react'
import * as d3 from 'd3'

const D3Sunburst = {}

const modes = {
  totalStock: d => d.statistics.totalStock,
  totalStockValue: d => d.statistics.totalStockValue,
  totalRevenue: d => d.statistics.totalRevenue,
  totalProfit: d => d.statistics.totalProfit,
  totalSold: d => d.statistics.totalSold,
  totalReorderpoint: d => d.statistics.totalReorderpoint,
  totalReorderpointValue: d => d.statistics.totalReorderpointValue,
}

D3Sunburst.create = (el, data, config) => {
  // console.log('creating graph', config.mode)
  var width = 700,
    height = 700,
    radius = Math.min(width, height) / 2 - 10

  var formatNumber = d3.format(',d')

  var x = d3.scaleLinear().range([0, 2 * Math.PI])

  var y = d3.scaleSqrt().range([0, radius])

  var color = d3.scaleOrdinal(d3.schemeCategory20)

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
    .select(el)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  let root = d3.hierarchy(data)

  root.sum(function(d) {
    return d.itemID && d.statistics ? modes[config.mode](d) : 0
  })

  svg
    .selectAll('path')
    .data(partition(root).descendants())
    .enter()
    .append('path')
    .attr('d', arc)
    .style('fill', function(d) {
      return d.data.color || color((d.children ? d : d.parent).data.name)
    })
    .on('click', click)
    .on('mouseover', hover)
    .append('title')

  function click(d) {
    config.setParentState({
      selected: d,
    })
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

  function hover(d) {
    config.setParentState({
      hovered: d,
    })
  }

  d3.select(self.frameElement).style('height', height + 'px')
  return svg
}

D3Sunburst.update = (el, data, config, chart) => {
  console.log('updating graph', config.mode)
}

D3Sunburst.destroy = () => {
  // Cleaning code here
}

export default D3Sunburst
