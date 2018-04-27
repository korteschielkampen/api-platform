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
      temporary_access_token: "onbekend",
      access_token: "onbekend",
      refresh_token: "onbekend",
      accountID: "onbekend",
      accountName: "onbekend",
      accountLink: "onbekend"
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
      if (data.body.error) {throw data.body}
      data.body && this.setState({
        status: "Aanvraag permanente sleutel succesvol",
        statusColor: "lightgreen",
        access_token: data.body.authData.access_token,
        refresh_token: data.body.authData.refresh_token,
        accountID: data.body.authData.account_id,
        accountName: data.body.authData.account_name,
        accountLink: data.body.authData.account_link
    })})
    .catch(err => {
      console.log(err);
      this.setState({
        status: `${err.error} - ${err.error_description}`,
        statusColor: "red"
      })});
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p> Redirect vanaf Lightspeed. </p>
          <p> Bent u per ongeluk door dit proces gelopen? Dat kan verder geen kwaad, er wordt geen data opslagen tenzij u verder gaat </p>
          <p> De onderstaande knop verzegelt uw tijdelijke sleutel, vraagt details rondom uw account aan, en slaat deze op in onze DynamoDB.</p>
          <button style={{marginBottom: "2rem"}} onClick={this.getPermanentKey}>Verzegel uw tijdelijke key</button>
          <p
            style={{
              backgroundColor: this.state.statusColor,
              padding: "1rem",
              borderRadius: "1rem"
            }}>
            Status: {this.state.status}
          </p>
          <p> Temporary access key: {this.state.temporary_access_token} </p>
          <p> Access key: {this.state.access_token} </p>
          <p> Refresh key: {this.state.refresh_token} </p>
          <p> Account ID: {this.state.accountID} </p>
          <p> Account Name: {this.state.accountName} </p>
          <p> Account Link: {this.state.accountLink} </p>

        </div>
      </div>
    )
  }
}

export default IndexPage
