import React from 'react'
import Link from 'gatsby-link'
import queryString from 'query-string'

import styles from './index.module.css'

const lambdaURL =
  process.env.NODE_ENV === 'production' ? '/.netlify/functions' : '/localhost:9000'

class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: "onbekend",
      statusColor: "grey",
      access_token: "onbekend",
      refresh_token: "onbekend",
      account_id: "onbekend",
      account_name: "onbekend",
      account_link: "onbekend"
    }
  }

  getKeys = () => {
    const options = {
      method: "GET"
    };

    fetch(`${lambdaURL}/get-lightspeed-moneybird-dynamo`, options)
      .then(res => {
        return res.json()
      })
      .then(data => {
        console.log(data);
        data.body && this.setState({
          ...data.body.Item,
          status: "Succesvol data opgehaald bij DynamoDB",
          statusColor: "lightgreen"
      })})
      .catch(err => {
        this.setState({
          storageStatus: `Error bij aanvraag van data: ${err}`,
          storageStatusColor: "red"
        })
      });
  }

  refreshKeys = () => {
    
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p> Admin voor Lightspeed API -> Moneybird API</p>
          <button style={{marginBottom: "2rem"}} onClick={this.getKeys}>Verkrijg data van DynamoDB</button>
          <p
            style={{
              backgroundColor: this.state.statusColor,
              padding: "1rem",
              borderRadius: "1rem"
            }}>
            Status: {this.state.status}
          </p>
          <p> Permanente sleutel: {this.state.access_token} </p>
          <p> Refresh sleutel: {this.state.refresh_token} </p>
          <p> Account ID: {this.state.account_id} </p>
          <p> Account Name: {this.state.account_name} </p>
          <p> Account Link: {this.state.account_link} </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
