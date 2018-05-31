import React from 'react'

import styles from './index.module.css'

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
          items: data.body,
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
          items: data.body,
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
    console.log(this.state.dayreports)
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p>Assortimentsbeheer</p>
          {/* <button
            className={classNames(styles.button, styles.buttonGrey)}
            onClick={this.login.bind(this)}
          >
            Login
          </button>
          <button
            className={classNames(styles.button, styles.buttonGrey)}
            onClick={this.logout.bind(this)}
          >
            logout
          </button> */}
        </div>

        <div className={styles.content}>
          <h1>Status</h1>
          <p
            style={{ backgroundColor: this.state.statusColor }}
            className={styles.statusBar}
          >
            {this.state.status}
          </p>
        </div>

        <div className={styles.content}>
          <button className={styles.button} onClick={this.getItems}>
            Get items
          </button>
          <button className={styles.button} onClick={this.getSales}>
            Get sales
          </button>
          <button className={styles.button} onClick={this.getData}>
            Get data
          </button>
        </div>
      </div>
    )
  }
}

export default IndexPage
