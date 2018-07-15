import React from 'react'

import styles from './index.module.css'

import Card from '../components/Card'
import notify from '../components/Flash/notify.js'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

const lambdas = [
  {
    text: 'Update sales, items and categories \n (5min)',
    name: 'updateEverything',
    url: `${lambdaURL}/algorithm-read`,
  },
  {
    text: "Tag all items. \n (Don't stay up)",
    name: 'tag',
    url: `${lambdaURL}/algorithm-tag`,
  },
  {
    text: 'Trigger accountancy integration',
    name: 'accountancy',
    url: `${lambdaURL}/integration-accountancy`,
  },
  {
    text: 'Trigger report',
    name: 'report',
    url: `${lambdaURL}/integration-report`,
  },
]

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
            {lambdas.map((lambda, key) => {
              return (
                <div key={key} className={styles.cardMedium}>
                  <Card
                    text={lambda.text}
                    button={{
                      text: 'Go',
                      handler: () =>
                        this.triggerLambda({
                          name: lambda.name,
                          url: lambda.url,
                        }),
                    }}
                  />
                </div>
              )
            })}
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
