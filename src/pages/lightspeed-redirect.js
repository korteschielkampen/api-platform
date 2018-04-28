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
      status: "Nog niet aangevraagd",
      statusColor: "grey",
      temporary_access_token: "onbekend",
      access_token: "onbekend",
      refresh_token: "onbekend",
      account_id: "onbekend",
      account_name: "onbekend",
      account_link: "onbekend"
    }
    this.getKeys = this.getKeys.bind(this);
  }

  async getKeys () {
    const {code} = queryString.parse(this.props.location.search);
    const apiUrl = `${lambdaURL}/lightspeed-auth-init?code=${code}`;

    this.setState({temporary_access_token: code});

    try {

      const res = await fetch(apiUrl);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      this.setState({
        status: "Aanvraag permanente sleutel succesvol",
        statusColor: "lightgreen",
        access_token: data.body.authData.access_token,
        refresh_token: data.body.authData.refresh_token,
        account_id: data.body.authData.account_id,
        account_name: data.body.authData.account_name,
        account_link: data.body.authData.account_link
      })

    } catch(err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: "red"
      });
    }
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p> Redirect vanaf Lightspeed. </p>
          <p> Bent u per ongeluk door dit proces gelopen? Dat kan verder geen kwaad, er wordt geen data opslagen tenzij u verder gaat </p>
          <h1>Status</h1>
          <p style={{backgroundColor: this.state.statusColor}} className={styles.statusBar}>{this.state.status}</p>
          <h1>Data</h1>
          <button className={styles.button} onClick={this.getKeys}>Verzegel uw tijdelijke toegangssleutel</button>
          <div className={styles.card}>
            <p> Temporary access key: {this.state.temporary_access_token} </p>
            <p> Access key: {this.state.access_token} </p>
            <p> Refresh key: {this.state.refresh_token} </p>
            <p> Account ID: {this.state.account_id} </p>
            <p> Account Name: {this.state.account_name} </p>
            <p> Account Link: {this.state.account_link} </p>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
