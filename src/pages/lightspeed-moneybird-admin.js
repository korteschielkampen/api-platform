import React from 'react'
import Link from 'gatsby-link'

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

  async getKeys () {
    const options = {
      method: "GET"
    };
    const apiUrl = `${lambdaURL}/admin-read-auth`;

    try {

      const res = await fetch(apiUrl, options);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      data.body && this.setState({
        ...data.body.Item,
        status: "Succesvol data opgehaald bij DynamoDB",
        statusColor: "lightgreen",
        access_token: data.body.authData.access_token,
        refresh_token: data.body.authData.refresh_token,
        account_id: data.body.authData.account_id,
        account_name: data.body.authData.account_name,
        account_link: data.body.authData.account_link
      });

    } catch(err) {

      this.setState({
        status: `Error bij aanvraag van data: ${err}`,
        statusColor: "red"
      })

    }
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p> Admin voor Lightspeed API naar Moneybird API integratie</p>
          <button style={{marginBottom: "2rem"}} onClick={this.getKeys}>Verkrijg data van DynamoDB</button>
          <p
            style={{
              backgroundColor: this.state.statusColor,
              padding: "1rem",
              borderRadius: "1rem"
            }}>
            Status: {this.state.status}
          </p>
          <p> Access key: {this.state.access_token} </p>
          <p> Refresh key: {this.state.refresh_token} </p>
          <p> Account ID: {this.state.account_id} </p>
          <p> Account Name: {this.state.account_name} </p>
          <p> Account Link: {this.state.account_link} </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
