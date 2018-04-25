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

  getPermanentKey = () => {
    let {code} = queryString.parse(this.props.location.search)
    fetch(`${lambdaURL}/auth?code=${code}`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      data.body && this.setState({permanentKey: data.body})
    })
    .catch(err => {
      console.error(err)
      this.setState({permanentKey: "Mislukt"})})
  }

  componentDidMount() {
    this.getPermanentKey();
  }

  render () {
    console.log(this.state.permanentKey)
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

// lightspeed-redirect/?code=f6d386a76b699b78269b2ed89ac92873463fc737&state=korteschiel-kampen
