import React from 'react'
import _ from 'lodash'

import styles from './index.module.css'

import Card from '../components/Card'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

const apiUrls = {
  updateEverything: `${lambdaURL}/integration-accountancy`,
  tag: `${lambdaURL}/algorithm-tag`,
  accountancy: `${lambdaURL}/algorithm-read`,
  report: `${lambdaURL}/integration-report`,
}

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: {
        text: 'Geen status',
        color: 'grey',
        sign: 'dash',
        show: 0,
      },
    }
    this.trigger = this.trigger.bind(this)
  }

  async trigger(action) {
    console.log('ACTION: ', action)
    try {
      const res = await fetch(apiUrls[action.name])
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      data.body &&
        this.setState({
          status: {
            text: `${action.name} succesvol`,
            color: 'green',
            sign: 'done',
            show: 2,
          },
        })
    } catch (err) {
      this.setState({
        status: {
          text: `${action.name} ${JSON.stringify(err.body)}`,
          color: 'red',
          sign: 'cross',
          show: 2,
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
                button={{
                  text: 'Go',
                  handler: () => this.trigger({ name: 'updateEverything' }),
                }}
              />
            </div>
            <div className={styles.cardSmall}>
              <Card
                text="Tag all items"
                button={{
                  text: 'Go',
                  handler: () => this.trigger({ name: 'tag' }),
                }}
              />
            </div>
            <div className={styles.cardSmall}>
              <Card
                text="Trigger accountancy integration"
                button={{
                  text: 'Go',
                  handler: () => this.trigger({ name: 'accountancy' }),
                }}
              />
            </div>
            <div className={styles.cardSmall}>
              <Card
                text="Trigger report"
                button={{
                  text: 'Go',
                  handler: () => this.trigger({ name: 'report' }),
                }}
              />
            </div>
            <div className={styles.cardBroad}>
              <Card text={this.state.status.text} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
