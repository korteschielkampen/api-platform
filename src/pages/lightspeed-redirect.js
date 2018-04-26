import React from 'react'
import Link from 'gatsby-link'
import queryString from 'query-string'

import styles from './index.module.css'

const lambdaURL =
  process.env.NODE_ENV === 'production' ? '/.netlify/functions' : '/localhost:9000'

class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {permanentKey: "Wordt Aangevraagd"}
  }

  getPermanentKey () {
    let {code} = queryString.parse(this.props.location.search);
    fetch(`${lambdaURL}/auth-lightspeed-init?code=${code}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      data.body && this.setState({permanentKey: data.body})
    })
    .catch(err => {
      console.log(err)
      this.setState({permanentKey: data.body})});
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
          <p> We vragen nu een permanente sleutel aan: {this.state.permanentKey} </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
