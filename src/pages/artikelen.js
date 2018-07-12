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
    return (
      <div className={styles.container}>
        <Breadcrumbs selected={this.state.hovered} />
        <div className={styles.starburstContainer}>
          {!_.isEmpty(this.state.items) && (
            <Sunburst
              data={this.state.items}
              size={[700, 700]}
              config={{ setParentState: this.setState.bind(this) }}
            />
          )}
          <div className={styles.cardsVertical}>
            {this.state.selected.data &&
              !this.state.selected.data.hasOwnProperty('itemID') && [
                this.state.selected.data && (
                  <div
                    className={styles.cardBroad}
                    key={this.state.selected.data.categoryID + 'selectedbox'}
                  >
                    <Card
                      name={this.state.selected.data.name}
                      statistics={this.state.selected.data.statisticsSub}
                    />
                  </div>
                ),
                this.state.hovered.data && (
                  <div
                    className={styles.cardBroad}
                    key={this.state.hovered.data.categoryID + 'hoveredbox'}
                  >
                    <Card
                      name={this.state.hovered.data.name}
                      statistics={this.state.hovered.data.statisticsSub}
                    />
                  </div>
                ),
              ]}
          </div>
        </div>

        <div className={styles.content}>
          {/* Is category */}

          <h3>Subcategorieën:</h3>
          <div className={styles.cards}>
            {this.state.selected.data &&
              !this.state.selected.data.hasOwnProperty('itemID') &&
              (this.state.selected.data &&
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
                        <div className={styles.cardSmall} key={key}>
                          <Card
                            name={value.name}
                            statistics={value.statisticsSub}
                          />
                        </div>
                      )
                    }
                  }))}
          </div>

          {/* Has Articles */}
          <h3>Artikelen: </h3>
          <div className={styles.cards}>
            {this.state.selected.data &&
              !_.isEmpty(
                _.filter(this.state.selected.data.children, 'itemID')
              ) &&
              _.map(
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
                    <div className={styles.cardSmall} key={key}>
                      <Card
                        name={value.name}
                        statistics={value.statistics}
                        link={link}
                      />
                    </div>
                  )
                }
              )}

            {/* Is Article */}
            {this.state.selected.data &&
              this.state.selected.data.hasOwnProperty('itemID') && (
                <div className={styles.cardSmall}>
                  <Card
                    type="important"
                    name={this.state.selected.data.name}
                    statistics={this.state.selected.data.statistics}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
