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
      status: "Wordt Aangevraagd",
      statusColor: "grey",
      storageStatus: "Nog niet aangevraagd",
      storageStatusColor: "grey",
      temporary_access_token: "onbekend",
      access_token: "onbekend",
      refresh_token: "onbekend"
    }
  }

  getPermanentKey = () => {
    let {code} = queryString.parse(this.props.location.search);
    this.setState({temporary_access_token: code});

    fetch(`${lambdaURL}/auth-lightspeed-init?code=${code}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      data.body.error && (() => { throw data.body.error })();
      let refresh_token = data.body.refresh_token ?  data.body.refresh_token : data.body.error;
      let access_token = data.body.access_token ?  data.body.access_token : data.body.error;
      data.body && this.setState({
        status: "Aanvraag permanente sleutel succesvol",
        statusColor: "lightgreen",
        access_token: access_token,
        refresh_token: refresh_token,
    })})
    .catch(err => {
      this.setState({
        status: `Error bij aanvraag permanente sleutel: ${err}`,
        statusColor: "red"
      })});
  }

  storePermanentKeys = () => {
    const payload = {
      temporary_access_token: this.state.temporary_access_token,
      access_token: this.state.access_token,
      refresh_token: this.state.refresh_token
    };

    const options = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`${lambdaURL}/store-lightspeed-dynamo`, options)
      .then(res => {
        return res.json()
      })
      .then(data => {
        data.headers && (() => { throw data.body.error })();
        data.body && this.setState({
          storageStatus: "Succesvol opgeslagen in DynamoDB",
          storageStatusColor: "lightgreen"
      })})
      .catch(err => {
        this.setState({
          storageStatus: `Error bij aanvraag permanente sleutel: ${err}`,
          storageStatusColor: "red"
        })
      });
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p> Redirect vanaf Lightspeed. </p>
          <p> Bent u per ongeluk door dit proces gelopen? Dat kan verder geen kwaad, er wordt geen data opslagen tenzij u deze opslaat door op de "Sla op in DynamoDB" button klikt. </p>
          <button style={{marginBottom: "2rem"}} onClick={this.getPermanentKey}>Verzegel uw tijdelijke key en vraag extra info aan</button>
          <p
            style={{
              backgroundColor: this.state.statusColor,
              padding: "1rem",
              borderRadius: "1rem"
            }}>
            Status: {this.state.status}
          </p>
          <p> Tijdelijke sleutel: {this.state.temporary_access_token} </p>
          <p> Permanente sleutel: {this.state.access_token} </p>
          <p> Refresh sleutel: {this.state.refresh_token} </p>
          <button style={{marginBottom: "2rem"}} onClick={this.storePermanentKeys}>Sla op in DynamoDB</button>
          <p
            style={{
              backgroundColor: this.state.storageStatusColor,
              padding: "1rem",
              borderRadius: "1rem"
            }}>
            Status: {this.state.storageStatus}
          </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
