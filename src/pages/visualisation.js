import React from 'react'

import styles from './index.module.css'

import Barchart from '../components/Barchart'
import Sunburst from '../components/Sunburst'
import SunburstW from '../components/Sunburst-w'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      status: "Haven't done anything yet",
      statusColor: 'lightgrey',
    }
    this.getItems = this.getItems.bind(this)
    this.getSales = this.getSales.bind(this)
    this.getData = this.getData.bind(this)
  }

  async getItems() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    const apiUrl = `${lambdaURL}/admin-read-items`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      data.body &&
        this.setState({
          status: 'Succesvol items opgehaald',
          statusColor: 'lightgreen',
        })
    } catch (err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: 'red',
      })
    }
  }

  async getSales() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    const apiUrl = `${lambdaURL}/admin-read-sales`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      data.body &&
        this.setState({
          status: 'Succesvol sales opgehaald',
          statusColor: 'lightgreen',
        })
    } catch (err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: 'red',
      })
    }
  }

  async getData() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    const apiUrl = `${lambdaURL}/admin-read-weighted-items`

    try {
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      data.body &&
        this.setState({
          items: data.body,
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
    console.log(this.state.items)
    return (
      <div className={styles.container}>
        <div className={styles.buttonContainer}>
          {/* <button className={styles.button} onClick={this.getItems}>
            Get items
          </button>
          <button className={styles.button} onClick={this.getSales}>
            Get sales
          </button> */}
          <button className={styles.button} onClick={this.getData}>
            Get data
          </button>
        </div>
        <div className={styles.content}>
          <Sunburst data={[1, 2, 3, 4, 5, 6, 7, 8]} size={[700, 700]} />
        </div>
        <div className={styles.content}>
          <div className={styles.cards} />
        </div>
      </div>
    )
  }
}

export default IndexPage
