import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'

const lambdaURL =
  process.env.NODE_ENV === 'production' ? '/.netlify/functions' : '/localhost:9000'

const client_id = "4c23f9e681c44d339359a38dc340522fae805ddab5e372c39762ef91c080179d"
const scope = "employee:reports"
const temporaryTokenLink = `https://cloud.lightspeedapp.com/oauth/authorize.php?response_type=code&client_id=${client_id}&scope=${scope}`

class IndexPage extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h3><a href={temporaryTokenLink}> Start integratie met Lightspeed Retail </a></h3>
          <p>Deze link vraagt toegang tot uw account op Lightspeed Retail, gebruik deze link alleen als hij voor u is bedoeld.</p>
        </div>
      </div>
    )
  }
}

export default IndexPage
