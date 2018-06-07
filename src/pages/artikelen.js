import React from 'react'
import _ from 'lodash'

import styles from './index.module.css'

import Sunburst from '../components/Sunburst'
import Card from '../components/Card'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

const dataURL =
  process.env.NODE_ENV === 'production'
    ? '/data/sunburst.json'
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
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  async getData() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }

    const apiUrl =
      process.env.NODE_ENV === 'production'
        ? '/data/sunburst.json'
        : `${lambdaURL}/admin-read-weighted-items`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      process.env.NODE_ENV === 'production'
        ? this.setState({
            items: data,
            current: { data: data },
            status: 'Succesvol data opgehaald',
            statusColor: 'lightgreen',
          })
        : data.body &&
          this.setState({
            items: data.body.body,
            current: { data: data.body.body },
            status: 'Succesvol data opgehaald',
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
          {!_.isEmpty(this.state.items) && (
            <Sunburst
              data={this.state.items}
              size={[700, 700]}
              config={{ setParentState: this.setState.bind(this) }}
            />
          )}
        </div>

        <div className={styles.content}>
          {/* Is category */}
          {this.state.current.data &&
            !this.state.current.data.hasOwnProperty('itemID') && (
              <div className={styles.cardsContainer}>
                <h3>
                  Categorie:{' '}
                  {!_.isEmpty(this.state.current) &&
                    this.state.current.data.name}
                </h3>
                <div className={styles.cards}>
                  <Card
                    name={this.state.current.data.name}
                    statistics={this.state.current.data.statisticsSub}
                    type="important"
                  />
                  {this.state.current.data &&
                    this.state.current.data.children &&
                    this.state.current.data.children
                      .sort((prev, next) => {
                        return (
                          next.statisticsSub.totalRevenue -
                          prev.statisticsSub.totalRevenue
                        )
                      })
                      .map((value, key) => {
                        if (!value.hasOwnProperty('itemID')) {
                          return (
                            <Card
                              name={value.name}
                              statistics={value.statisticsSub}
                              key={key}
                            />
                          )
                        }
                      })}
                </div>
              </div>
            )}

          {/* Has Articles */}
          {this.state.current.data &&
            !_.isEmpty(
              _.filter(this.state.current.data.children, 'itemID')
            ) && (
              <div className={styles.cardsContainer}>
                <h3>Artikelen</h3>
                <div className={styles.cards}>
                  {_.map(
                    _.filter(this.state.current.data.children, 'itemID').sort(
                      (prev, next) => {
                        return (
                          next.statistics.totalRevenue -
                          prev.statistics.totalRevenue
                        )
                      }
                    ),
                    (value, key) => {
                      let link = `https://us.lightspeedapp.com/?name=item.views.item&form_name=view&id=${
                        value.itemID
                      }&tab=details`
                      return (
                        <Card
                          name={value.name}
                          statistics={value.statistics}
                          key={key}
                          link={link}
                        />
                      )
                    }
                  )}
                </div>
              </div>
            )}

          {/* Is Article */}
          {this.state.current.data &&
            this.state.current.data.hasOwnProperty('itemID') && (
              <div className={styles.cardsContainer}>
                <h3>Artikel</h3>
                <div className={styles.cards}>
                  <Card
                    name={this.state.current.data.name}
                    statistics={this.state.current.data.statistics}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    )
  }
}

export default IndexPage
