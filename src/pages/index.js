import React from 'react'
import Link from 'gatsby-link'

const lambdaURL =
  process.env === 'production' ? '/.netlify/functions' : '/localhost:9000'

fetch(`${lambdaURL}/hello`)
  .then(res => res.json())
  .then(data => console.log(data.hello))
  .catch(err => console.error(err))

const IndexPage = () => (
  <div>
  </div>
)

export default IndexPage
