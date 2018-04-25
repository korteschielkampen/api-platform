import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'

const lambdaURL =
  process.env === 'production' ? '/.netlify/functions' : '/localhost:9000'

class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {response: "No response yet...."}
  }

  getData = async () => {
    fetch(`${lambdaURL}/hello`)
    .then(res => res.json())
    .then(data => {
      console.log(this)
      this.setState({response: data.hello})
    })
    .catch(err => console.error(err))
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <button onClick={this.getData} className={styles.button}> Click me </button>
          <p>{this.state.response}</p>
        </div>
      </div>
    )
  }
}
export default IndexPage
