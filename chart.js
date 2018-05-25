// var fs = require('fs')
// const sharp = require('sharp')
// var anychartExport = require('anychart-nodejs')
// const strictUriEncode = require('strict-uri-encode')
//
// var chart =
//   "var chart = anychart.pie([10, 20, 7, 18, 30]); chart.bounds(0, 0, 800, 600); chart.container('container'); chart.draw()"
//

//
//

// const D3Node = require('d3-node')
// const d3n = new D3Node() // initializes D3 with container element
//
// d3n.createSVG(10, 20).append('g') // create SVG w/ 'g' tag and width/height
// console.log(d3n.svgString()) // output: <svg width=10 height=20 xmlns="http://www.w3.org/2000/svg"><g></g></svg>
//

const fs = require('fs')
const sharp = require('sharp')
const D3Node = require('d3-node')
const d3 = D3Node.d3

const data = [
  {
    key: 1,
    value: 93.24,
  },
  {
    key: 5,
    value: 94.24,
  },
  {
    key: 10,
    value: 95.24,
  },
  {
    key: 11,
    value: 100.24,
  },
]

function line({
  data,
  selector: _selector = '#chart',
  container: _container = `
    <div id="container">
      <h2>Line Chart</h2>
      <div id="chart"></div>
    </div>
  `,
  style: _style = '',
  width: _width = 960,
  height: _height = 500,
  margin: _margin = { top: 20, right: 20, bottom: 60, left: 30 },
  lineWidth: _lineWidth = 1.5,
  lineColor: _lineColor = 'steelblue',
  isCurve: _isCurve = true,
  tickSize: _tickSize = 5,
  tickPadding: _tickPadding = 5,
} = {}) {
  const d3n = new D3Node({
    selector: _selector,
    svgStyles: _style,
    container: _container,
  })

  const d3 = d3n.d3
  const width = _width - _margin.left - _margin.right
  const height = _height - _margin.top - _margin.bottom

  const svg = d3n
    .createSVG(_width, _height)
    .append('g')
    .attr('transform', `translate(${_margin.left}, ${_margin.top})`)

  const g = svg.append('g')

  const xScale = d3.scaleLinear().rangeRound([0, width])
  const yScale = d3.scaleLinear().rangeRound([height, 0])
  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(_tickSize)
    .tickPadding(_tickPadding)
  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(_tickSize)
    .tickPadding(_tickPadding)

  const lineChart = d3
    .line()
    .x(d => xScale(d.key))
    .y(d => yScale(d.value))

  if (_isCurve) lineChart.curve(d3.curveBasis)

  xScale.domain(d3.extent(data, d => d.key))
  yScale.domain(d3.extent(data, d => d.value))

  g
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  g.append('g').call(yAxis)

  g
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', _lineColor)
    .attr('stroke-width', _lineWidth)
    .attr('d', lineChart)

  return d3n
}

let chart = line({ data: data }).svgString()

try {
  sharp(Buffer.from(chart, 'utf8')).toFile('chart.jpg', (err, info) => {
    !err ? console.log('PNG written') : console.log('PNG error', err)
  })
  fs.writeFile('chart.svg', chart, err => {
    !err ? console.log('SVG written') : console.log('SVG error')
  })
} catch {
  console.log('EEEEERRRROR')
}

'https://image-charts.com/chart?chs=700x190&chd=t:60,40&cht=p3&chl=Hello%7CWorld&chan&chf=ps0-0,lg,45,ffeb3b,0.2,f44336,1%7Cps0-1,lg,45,8bc34a,0.2,009688,1'(
  'https://image-charts.com/chart?&chs=999x999&cht=lxy:nda&chd=t:10,20,40,80,90,95,99|20,30,40,50,60,70,80|-1|5,10,22,35,85'
