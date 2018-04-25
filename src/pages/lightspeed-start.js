import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'

const lambdaURL =
  process.env.NODE_ENV === 'production' ? '/.netlify/functions' : '/localhost:9000'

class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {response: "No response yet...."}
  }

  getData = () => {
    fetch(`${lambdaURL}/hello`)
    .then(res => res.json())
    .then(data => {
      this.setState({response: data.body})
    })
    .catch(err => console.error(err))
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <button onClick={this.getData} className={styles.button}> Start Integratie met Lightspeed Retail </button>
          {/* <p>{this.state.response}</p> */}
        </div>
      </div>
    )
  }
}

export default IndexPage
