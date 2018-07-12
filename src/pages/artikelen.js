import React from 'react'
import _ from 'lodash'

import styles from './index.module.css'

import Sunburst from '../components/Sunburst'
import Card from '../components/Card'
import Breadcrumbs from '../components/Breadcrumbs'

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
      selected: {},
      hovered: {},
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
        : `${lambdaURL}/analytics-starburst`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      process.env.NODE_ENV === 'production'
        ? this.setState({
            items: data,
            selected: { data: data },
            status: 'Succesvol data opgehaald',
            statusColor: 'lightgreen',
          })
        : data.body &&
          this.setState({
            items: data.body.body,
            selected: { data: data.body.body },
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
    // console.log(this.state.items)
    return (
      <div className={styles.container}>
        {this.state.hovered.data && (
          <Breadcrumbs selected={this.state.hovered} />
        )}
        {!_.isEmpty(this.state.items) && (
          <div className={styles.starburstContainer}>
            <Sunburst
              data={this.state.items}
              size={[700, 700]}
              config={{ setParentState: this.setState.bind(this) }}
            />
          </div>
        )}

        <div className={styles.content}>
          {/* Is category */}
          <h3>Geselecteerde categorie:</h3>
          {this.state.selected.data &&
            !this.state.selected.data.hasOwnProperty('itemID') && (
              <div className={styles.cards}>
                <Card
                  name={this.state.selected.data.name}
                  statistics={this.state.selected.data.statisticsSub}
                  type="important"
                />
              </div>
            )}
          <h3>Subcategorieën:</h3>
          {this.state.selected.data &&
            !this.state.selected.data.hasOwnProperty('itemID') && (
              <div className={styles.cards}>
                {this.state.selected.data &&
                  this.state.selected.data.children &&
                  _.filter(this.state.selected.data.children, value => {
                    if (!value.hasOwnProperty('itemID')) {
                      return value
                    }
                  })
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
            )}

          {/* Has Articles */}
          <h3>Artikelen: </h3>
          {this.state.selected.data &&
            !_.isEmpty(
              _.filter(this.state.selected.data.children, 'itemID')
            ) && (
              <div className={styles.cards}>
                {_.map(
                  _.filter(this.state.selected.data.children, 'itemID').sort(
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
            )}

          {/* Is Article */}
          {this.state.selected.data &&
            this.state.selected.data.hasOwnProperty('itemID') && (
              <div className={styles.cardsContainer}>
                <h3>Artikel</h3>
                <div className={styles.cards}>
                  <Card
                    name={this.state.selected.data.name}
                    statistics={this.state.selected.data.statistics}
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
