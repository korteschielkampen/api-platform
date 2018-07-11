import React from 'react'
import Link from 'gatsby-link'
import queryString from 'query-string'
import classNames from 'classnames'

import styles from './index.module.css'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Nog niet aangevraagd',
      statusColor: 'grey',
      temporary_access_token: 'onbekend',
    }
    this.getKeys = this.getKeys.bind(this)
  }

  componentDidMount() {
    const { code } = queryString.parse(this.props.location.search)
    this.setState({ temporary_access_token: code }, this.getKeys.bind(this))
  }

  async getKeys() {
    try {
      const apiUrl = `${lambdaURL}/oauth-slack?code=${
        this.state.temporary_access_token
      }`

      const res = await fetch(apiUrl)
      if (!res.ok) {
        throw await res.json()
      }
      let data = await res.json()

      this.setState({
        status: 'Aanvraag permanente sleutel succesvol',
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
          <p> Redirect vanaf Slack </p>
          <h1>Status</h1>
          <p
            style={{ backgroundColor: this.state.statusColor }}
            className={styles.statusBar}
          >
            {this.state.status}
          </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
