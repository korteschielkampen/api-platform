import React from 'react'
import Link from 'gatsby-link'
import _ from 'underscore'

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
      account_link: "onbekend",
      expires_in: "onbekend",
      taxData: []
    }
    this.getKeys = this.getKeys.bind(this);
  }

  async getKeys () {
    const options = {
      method: "GET"
    };
    const apiUrl = `${lambdaURL}/lightspeed-admin`;

    try {

      const res = await fetch(apiUrl, options);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      console.log(data);

      data.body && this.setState({
        ...data.body.Item,
        status: "Succesvol data opgehaald bij DynamoDB",
        statusColor: "lightgreen",
        access_token: data.body.authData.access_token,
        refresh_token: data.body.authData.refresh_token,
        account_id: data.body.authData.account_id,
        account_name: data.body.authData.account_name,
        account_link: data.body.authData.account_link,
        expires_in: data.body.authData.expires_in,
        taxData: data.body.taxData
      });

    } catch(err) {

      this.setState({
        status: `Error bij aanvraag van data: ${err}`,
        statusColor: "red"
      })

    }
  }

  render () {
    console.log(this.state.taxData)
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p> Admin voor Lightspeed API naar Moneybird API integratie</p>
          <button style={{marginBottom: "2rem"}} onClick={this.getKeys}>Verkrijg data van DynamoDB</button>

          <h1>Authenticatie</h1>
          <div className={styles.card}>
            <p
              style={{
                backgroundColor: this.state.statusColor,
                padding: "1rem",
                borderRadius: "1rem"
              }}>
              Status: {this.state.status}
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <h1>Data</h1>
          { (Array.reverse(Object.values(this.state.taxData))).map(((taxDay, key)=>{
            return (
              <div key={key} className={styles.card}>
                <p className={styles.cardHeader}> Date: {taxDay[0].date} </p>
                { taxDay.map((taxItem, key)=>{
                  return (
                    <p key={key} className={styles.cardText}> Taxclass: {taxItem.taxClassName} Subtotaal: {taxItem.subtotal} </p>
                  )})}
              </div>)
          }))}

        </div>
      </div>
    )
  }
}

export default IndexPage
