import React from 'react'
import _ from 'lodash'
import qS from 'query-string'
import moment from 'moment'

import styles from './index.module.css'

import Card from '../components/Card'
import notify from '../components/Flash/notify.js'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

let actionGroups = [
  {
    text: 'Update data',
    actions: [
      {
        text: 'Sunburst',
        name: 'UPDATE_DATA',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-read?${qS.stringify({
          datatype: 'sunburst',
        })}`,
        status: 'dev',
      },
      {
        text: 'Categories',
        name: 'UPDATE_DATA',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-read?${qS.stringify({
          datatype: 'categories',
        })}`,
        status: 'dev',
      },
      {
        text: 'Items',
        name: 'UPDATE_DATA',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-read?${qS.stringify({
          datatype: 'items',
        })}`,
        status: 'dev',
      },
      {
        text: 'Sales',
        name: 'UPDATE_DATA',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-read?${qS.stringify({
          datatype: 'sales',
        })}`,
        status: 'dev',
      },
    ],
  },
  {
    text: 'Tagging',
    actions: [
      {
        text: 'Sold items',
        name: 'TAG_SOLD_ITEMS',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-tag?${qS.stringify({
          tag: 'verkocht2018',
        })}`,
        status: 'dev',
      },
      {
        text: 'Excess stock',
        name: 'TAG_EXCESS_STOCK',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-tag?${qS.stringify({
          tag: 'voorraadoverschot',
        })}`,
        status: 'dev',
      },
      {
        text: 'Impossible cost',
        name: 'TAG_IMPOSSIBLE_COST',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-tag?${qS.stringify({
          tag: 'verkeerdeinkoop',
        })}`,
        status: 'dev',
      },
    ],
  },
  {
    text: 'Accountancy',
    actions: [
      {
        text: 'Three ago',
        name: 'TRIGGER_ACCOUNTANCY',
        type: 'lambda',
        url: `${lambdaURL}/integration-accountancy?${qS.stringify({
          date: moment()
            .subtract(3, 'day')
            .format(),
        })}`,
        status: 'web',
      },
      {
        text: 'Two ago',
        name: 'TRIGGER_ACCOUNTANCY',
        type: 'lambda',
        url: `${lambdaURL}/integration-accountancy?${qS.stringify({
          date: moment()
            .subtract(2, 'day')
            .format(),
        })}`,
        status: 'web',
      },
      {
        text: 'Yesterday',
        name: 'TRIGGER_ACCOUNTANCY',
        type: 'lambda',
        url: `${lambdaURL}/integration-accountancy?${qS.stringify({
          date: moment()
            .subtract(1, 'day')
            .format(),
        })}`,
        status: 'web',
      },
      {
        text: 'Today',
        name: 'TRIGGER_ACCOUNTANCY',
        type: 'lambda',
        url: `${lambdaURL}/integration-accountancy`,
        status: 'web',
      },
    ],
  },
  {
    text: 'Reordering',
    actions: [
      {
        text: 'Set Reorderpoints',
        name: 'UPDATE_REORDERPOINTS',
        type: 'lambda',
        url: `${lambdaURL}/algorithm-reorder`,
        status: 'dev',
      },
    ],
  },
  {
    text: 'Reports',
    actions: [
      {
        text: 'Financial',
        name: 'TRIGGER_FINANCIAL_REPORT',
        type: 'lambda',
        url: `${lambdaURL}/integration-report`,
        status: 'web',
      },
    ],
  },
]

if (process.env.NODE_ENV === 'production') {
  actionGroups = _.map(actionGroups, actionGroup => {
    return _.filter(actionGroup.actions, { status: 'web' })
  })
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
            {actionGroups.map((actionGroup, key) => {
              return (
                <div key={key} className={styles.cardMedium}>
                  <Card
                    text={actionGroup.text}
                    buttons={_.map(actionGroup.actions, action => {
                      return {
                        ...action,
                        handler:
                          action.type === 'lambda'
                            ? () => {
                                return this.triggerLambda({
                                  name: action.name,
                                  url: action.url,
                                })
                              }
                            : undefined,
                      }
                    })}
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
