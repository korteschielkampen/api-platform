import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'

const client_id = process.env.LIGHTSPEED_CLIENT
const scope = "employee:reports"
const temporaryTokenLink = `https://cloud.lightspeedapp.com/oauth/authorize.php?response_type=code&client_id=${client_id}&scope=${scope}`

class IndexPage extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <button style={{marginBottom: "1rem"}}><a href={temporaryTokenLink}> Start integratie met Lightspeed Retail </a></button>
          <p>Deze link vraagt toegang tot uw account op Lightspeed Retail, gebruik deze link alleen als hij voor u is bedoeld.</p>
        </div>
      </div>
    )
  }
}

export default IndexPage
