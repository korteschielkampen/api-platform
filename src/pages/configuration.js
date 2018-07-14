import React from 'react'
import _ from 'lodash'

import styles from './index.module.css'

import Card from '../components/Card'
import notify from '../components/Flash/notify.js'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.triggerLambda = this.triggerLambda.bind(this)
  }

  async triggerLambda(action) {
    try {
      this.setState(notify('loading', action))
      const res = await fetch(action.url)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()
      data.body && this.setState(notify('success', action))
    } catch (err) {
      this.setState(notify('error', action, err))
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
                  handler: () =>
                    this.triggerLambda({
                      name: 'updateEverything',
                      url: `${lambdaURL}/algorithm-read`,
                    }),
                }}
              />
            </div>
            <div className={styles.cardSmall}>
              <Card
                text="Tag all items"
                button={{
                  text: 'Go',
                  handler: () =>
                    this.triggerLambda({
                      name: 'tag',
                      url: `${lambdaURL}/algorithm-tag`,
                    }),
                }}
              />
            </div>
            <div className={styles.cardSmall}>
              <Card
                text="Trigger accountancy integration"
                button={{
                  text: 'Go',
                  handler: () =>
                    this.triggerLambda({
                      name: 'accountancy',
                      url: `${lambdaURL}/integration-accountancy`,
                    }),
                }}
              />
            </div>
            <div className={styles.cardSmall}>
              <Card
                text="Trigger report"
                button={{
                  text: 'Go',
                  handler: () =>
                    this.triggerLambda({
                      name: 'report',
                      url: `${lambdaURL}/integration-report`,
                    }),
                }}
              />
            </div>
            {this.state.status && (
              <div className={styles.cardBroad}>
                <Card text={this.state.status.text} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
