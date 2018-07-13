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
    let selectedItem = this.state.selected
    let hoveredItem = this.state.hovered
    if (!_.isEmpty(this.state.items)) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <Breadcrumbs selected={hoveredItem} />
            <div className={styles.starburstContainer}>
              <Sunburst
                data={this.state.items}
                size={[700, 700]}
                config={{ setParentState: this.setState.bind(this) }}
              />
              <div className={styles.cardsVertical}>
                {!selectedItem.data.hasOwnProperty('itemID') && (
                  <div
                    className={styles.cardBroad}
                    key={selectedItem.data.categoryID + 'selectedbox'}
                  >
                    <Card
                      name={selectedItem.data.name}
                      statistics={
                        selectedItem.data.statisticsSub ||
                        hoveredItem.data.statistics
                      }
                      type="statistics"
                    />
                  </div>
                )}

                {hoveredItem.data && (
                  <div
                    className={styles.cardBroad}
                    key={hoveredItem.data.categoryID + 'hoveredbox'}
                  >
                    <Card
                      name={hoveredItem.data.name}
                      statistics={
                        hoveredItem.data.statisticsSub ||
                        hoveredItem.data.statistics
                      }
                      type="statistics"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.content}>
            {/* Is category */}
            {!selectedItem.data.hasOwnProperty('itemID') &&
              selectedItem.data.children &&
              _.filter(selectedItem.data.children, value => {
                if (!value.hasOwnProperty('itemID')) {
                  return value
                }
              }) && [
                <h3 key="Subcategorieën">Subcategorieën:</h3>,
                <div key="SubcategorieënContainer" className={styles.cards}>
                  {_.filter(selectedItem.data.children, value => {
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
                              type="statistics"
                            />
                          </div>
                        )
                      }
                    })}
                </div>,
              ]}
            {/* Has Articles */}
            {selectedItem.data &&
              !_.isEmpty(_.filter(selectedItem.data.children, 'itemID')) && [
                <h3 key="Artikelen">Artikelen: </h3>,
                <div key="ArtikelenContainer" className={styles.cards}>
                  {_.map(
                    _.filter(selectedItem.data.children, 'itemID').sort(
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
                            type="statistics"
                          />
                        </div>
                      )
                    }
                  )}
                </div>,
              ]}
          </div>
        </div>
      )
    } else {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1>Data aan het ophalen</h1>
          </div>
        </div>
      )
    }
  }
}

export default IndexPage
