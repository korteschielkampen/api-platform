import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'

const lambdaURL =
  process.env === 'production' ? '/.netlify/functions' : '/localhost:9000'

fetch(`${lambdaURL}/hello`)
  .then(res => res.json())
  .then(data => console.log(data.hello))
  .catch(err => console.error(err))

const IndexPage = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <button> Click me </button>
    </div>
  </div>
)

export default IndexPage
