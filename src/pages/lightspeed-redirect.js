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
      statusColor: "grey"
    }
  }

  getPermanentKey () {
    let {code} = queryString.parse(this.props.location.search);
    this.setState({tempKey: code});

    fetch(`${lambdaURL}/auth-lightspeed-init?code=${code}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      data.body && this.setState({
        permanentKey: data.body,
        status: "Aanvraag permanente sleutel succesvol",
        statusColor: "lightgreen"
    })})
    .catch(err => {
      console.log(err)
      this.setState({
        status: "Error bij aanvraag permanente sleutel",
        statusColor: "red"
      })});
  }

  componentDidMount() {
    this.getPermanentKey();
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p> Redirect vanaf Lightspeed. </p>
          <p> Bent u per ongeluk door dit proces gelopen? Dat kan verder geen kwaad, er wordt geen data opslagen als we niet vooraf wisten dat u deze link ging gebruiken. </p>
          <p
            style={{
              backgroundColor: this.state.statusColor,
              padding: "1rem",
              borderRadius: "1rem"
            }}> Status: {this.state.status} </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
