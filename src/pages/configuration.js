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
      status: {
        text: 'Geen status',
        color: 'grey',
        sign: 'dash',
      },
    }
    this.updateEverything = this.updateEverything.bind(this)
    this.tagItems = this.tagItems.bind(this)
    this.triggerAccountancy = this.triggerAccountancy.bind(this)
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
          status: {
            text: `Update succesvol`,
            color: 'green',
            sign: 'done',
          },
        })
    } catch (err) {
      this.setState({
        status: {
          text: `Update mislukt: ${JSON.stringify(err.body)}`,
          color: 'red',
          sign: 'cross',
        },
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
          status: {
            text: `Tagging succesvol`,
            color: 'green',
            sign: 'done',
          },
        })
    } catch (err) {
      this.setState({
        status: {
          text: `Tagging mislukt: ${JSON.stringify(err.body)}`,
          color: 'red',
          sign: 'cross',
        },
      })
    }
  }

  async triggerAccountancy() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    const apiUrl = `${lambdaURL}/integration-accountancy`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      data.body &&
        this.setState({
          status: {
            text: `Accountancy Succesvol`,
            color: 'green',
            sign: 'done',
          },
        })
    } catch (err) {
      this.setState({
        status: {
          text: `Accountancy mislukt: ${JSON.stringify(err.body)}`,
          color: 'red',
          sign: 'cross',
        },
      })
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Configuration</h1>
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
            <div className={styles.cardSmall}>
              <Card
                text="Trigger accountancy integration"
                button={{ text: 'Go', handler: this.triggerAccountancy }}
              />
            </div>
            <Card text={this.state.status.text} />
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
