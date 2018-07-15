import React from 'react'
import _ from 'lodash'

import styles from './index.module.css'

import Sunburst from '../components/Sunburst'
import Card from '../components/Card'
import Breadcrumbs from '../components/Breadcrumbs'
import notify from '../components/Flash/notify.js'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

/*
Havent setup remote storage for the starburst generations, this line
counters that. Might try an S3 bucket, could be interesting to avoid setting
up a real server for now. Could also be interesting as longterm storage for
backups. I'm doingdangerous shit with the itemdatabase.
*/

const dataURL =
  process.env.NODE_ENV === 'production'
    ? '/data/sunburst.json'
    : `${lambdaURL}/analytics-starburst`

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.getData = this.getData.bind(this)
    this.determineCategories = this.determineCategories.bind(this)
    this.determineItems = this.determineItems.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  async getData() {
    let action = { name: 'fetching' }
    try {
      this.setState(notify('loading', action))
      const res = await fetch(dataURL)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      this.setState({
        ...notify('success', action),
        items: data.body.data,
        selected: { data: data.body.data },
      })
    } catch (err) {
      console.log(err)
      this.setState(notify('error', action, err))
    }
  }

  sortingFunction(prev, next) {
    if (next.statisticsNested) {
      return (
        next.statisticsNested.totalRevenue - prev.statisticsNested.totalRevenue
      )
    } else {
      return next.statistics.totalRevenue - prev.statistics.totalRevenue
    }
  }

  determineCategories(selected) {
    if (selected && selected.data.children) {
      let categories = _.filter(selected.data.children, value => {
        if (!value.hasOwnProperty('itemID')) {
          return value
        }
      })
      return categories.sort(this.sortingFunction)
    }
  }

  determineItems(selected) {
    if (selected && selected.data.children) {
      let items = _.filter(selected.data.children, 'itemID')
      if (items.length !== 0) {
        return items.sort(this.sortingFunction)
      }
    }
  }

  render() {
    let selected = this.state.selected
    let hovered = this.state.hovered
    return (
      <div className={styles.container}>
        {this.state.items && (
          <div className={styles.content}>
            <Breadcrumbs selected={hovered || selected} />
            <div className={styles.starburstContainer}>
              <Sunburst
                data={this.state.items}
                size={[700, 700]}
                config={{ setParentState: this.setState.bind(this) }}
              />
              <div className={styles.cardsVertical}>
                {selected && (
                  <div className={styles.cardBroad}>
                    <Card
                      name={selected.data.name}
                      statistics={
                        selected.data.statisticsNested ||
                        selected.data.statistics
                      }
                      type="statistics"
                    />
                  </div>
                )}

                {hovered && (
                  <div className={styles.cardBroad}>
                    <Card
                      name={hovered.data.name}
                      statistics={
                        hovered.data.statisticsNested || hovered.data.statistics
                      }
                      type="statistics"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {this.state.items && (
          <div className={styles.content}>
            {this.determineCategories(selected) && [
              <h3 key="0">Subcategorieën:</h3>,
              <div key="1" className={styles.cards}>
                {this.determineCategories(selected).map((value, key) => {
                  return (
                    <div className={styles.cardSmall} key={key}>
                      <Card
                        name={value.name}
                        statistics={value.statisticsNested}
                        type="statistics"
                      />
                    </div>
                  )
                })}
              </div>,
            ]}

            {this.determineItems(selected) && [
              <h3 key="0">Artikelen: </h3>,
              <div key="1" className={styles.cards}>
                {this.determineItems(selected).map((value, key) => {
                  return (
                    <div className={styles.cardSmall} key={key}>
                      <Card
                        name={value.name}
                        statistics={value.statistics}
                        link={`https://us.lightspeedapp.com/?name=item.views.item&form_name=view&id=${
                          value.itemID
                        }&tab=details`}
                        type="statistics"
                      />
                    </div>
                  )
                })}
              </div>,
            ]}
          </div>
        )}
      </div>
    )
  }
}

export default IndexPage
