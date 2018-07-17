import React from 'react'
import _ from 'lodash'
import strictUriEncode from 'strict-uri-encode'

import styles from './index.module.css'

import Card from '../components/Card'
import notify from '../components/Flash/notify.js'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

let lambdas = [
  {
    text: 'Update categories',
    name: 'updateEverything',
    url: `${lambdaURL}/algorithm-read?datatype=categories`,
    status: 'dev',
  },
  {
    text: 'Update items',
    name: 'updateEverything',
    url: `${lambdaURL}/algorithm-read?datatype=items`,
    status: 'dev',
  },
  // {
  //   text: 'Update salelines',
  //   name: 'updateEverything',
  //   url: `${lambdaURL}/algorithm-read?datatype=salelines`,
  //   status: 'dev',
  // },
  {
    text: 'Update sales',
    name: 'updateEverything',
    url: `${lambdaURL}/algorithm-read?datatype=sales`,
    status: 'dev',
  },
  {
    text: 'Tag all sold items',
    name: 'tag',
    url: `${lambdaURL}/algorithm-tag?tag=verkocht2018`,
    status: 'dev',
  },
  {
    text: 'Tag excess stock',
    name: 'reorder',
    url: `${lambdaURL}/algorithm-tag?tag=voorraadoverschot`,
    status: 'dev',
  },
  {
    text: 'Set Reorderpoints',
    name: 'reorder',
    url: `${lambdaURL}/algorithm-reorder`,
    status: 'dev',
  },
  {
    text: 'Trigger accountancy integration yesterday',
    name: 'accountancy',
    url: `${lambdaURL}/integration-accountancy?date=${strictUriEncode(
      '2018-07-16T17:09:51+02:00'
    )}`,
    status: 'web',
  },
  {
    text: 'Trigger accountancy integration today',
    name: 'accountancy',
    url: `${lambdaURL}/integration-accountancy`,
    status: 'web',
  },
  {
    text: 'Trigger report',
    name: 'report',
    url: `${lambdaURL}/integration-report`,
    status: 'web',
  },
]

if (process.env.NODE_ENV === 'production') {
  lambdas = _.filter(lambdas, { status: 'web' })
}

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
                          ...(lambda.querystring && {
                            querystring: lambda.querystring,
                          }),
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
