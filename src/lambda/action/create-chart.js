import createFile from '../api/slack/create-file.js'
import fs from 'fs'
import ChartjsNode from 'chartjs-node'

export default async (data, channel) => {
  if (global.CanvasGradient === undefined) {
    global.CanvasGradient = function() {}
  }

  var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)',
  }

  var randomScalingFactor = function() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100)
  }

  var config = {
    type: 'line',
    data: {
      labels: [
        'Maandag',
        'Dinsdag',
        'Woensdag',
        'Donderdag',
        'Vrijdag',
        'Zaterdag',
        'Zondag',
      ],
      datasets: [
        {
          // label: 'My First dataset',
          backgroundColor: chartColors.red,
          borderColor: chartColors.red,
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
          ],
          fill: false,
        },
        {
          // label: 'My Second dataset',
          fill: false,
          backgroundColor: chartColors.blue,
          borderColor: chartColors.blue,
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
          ],
        },
      ],
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: 'Inkomsten',
        fontColor: 'rgba(255,255,255,1)',
        fontSize: '40',
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Days',
              fontSize: '30',
              fontColor: 'rgba(255,255,255,1)',
            },
          },
        ],
        yAxes: [
          {
            display: false,
          },
        ],
      },
    },
  }

  var chartNode = new ChartjsNode(1000, 1000)
  chartNode
    .drawChart(config)
    .then(() => {
      console.log('then 1')

      return chartNode.getImageBuffer('image/png')
    })
    .then(buffer => {
      console.log('then 3')
      Array.isArray(buffer) // => true
      return chartNode.getImageStream('image/png')
    })
    .then(streamResult => {
      console.log('then 3')
      streamResult.stream // => Stream object
      streamResult.length // => Integer length of stream
      return chartNode.writeImageToFile('image/png', './testimage.png')
    })
    .then(image => {
      console.log('then 4')
      console.log('image done')
    })

  // let chart = await createFile('none', channel)
  // return chart
}
