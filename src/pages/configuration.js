import React from 'react'
import _ from 'lodash'

import styles from './index.module.css'

import Card from '../components/Card'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: {},
      current: {},
      status: "Haven't done anything yet",
      statusColor: 'lightgrey',
    }
    this.updateEverything = this.updateEverything.bind(this)
    this.tagItems = this.tagItems.bind(this)
  }

  async updateEverything() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    const apiUrl = `${lambdaURL}/algorithm-read`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      data.body &&
        this.setState({
          status: 'Succesvol items opgehaald',
          statusColor: 'lightgreen',
        })
    } catch (err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: 'red',
      })
    }
  }

  async tagItems() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    const apiUrl = `${lambdaURL}/algorithm-tag`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      data.body &&
        this.setState({
          status: 'Succesvol items opgehaald',
          statusColor: 'lightgreen',
        })
    } catch (err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: 'red',
      })
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Oauth</h1>
          <div className={styles.cards}>
            <div className={styles.cardSmall}>
              <Card
                text="Update sales, items and categories"
                button={{ handler: this.updateEverything, text: 'Go' }}
              />
            </div>
            <div className={styles.cardSmall}>
              <Card
                text="Tag all items"
                button={{ text: 'Go', handler: this.tagItems }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
