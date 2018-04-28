import React from 'react'
import Link from 'gatsby-link'
import classNames from 'classnames'

import styles from './index.module.css'

const client_id = "64e1b03a820d8c9585cb7521cbc8605e";
const scope = "sales_invoices+bank"
const redirect_uri = encodeURI("https://rjkorteschiel.nl/moneybird-redirect/");
const temporaryTokenLink = `https://moneybird.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`

class IndexPage extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.cardHeader}>
            <a href={temporaryTokenLink}><button className={classNames(styles.button, styles.buttonBlue)}> Start integratie met Moneybird </button></a>
          </div>
          <p>Deze link vraagt toegang tot uw account op Moneybird, gebruik deze link alleen als hij voor u is bedoeld.</p>
        </div>
      </div>
    )
  }
}

export default IndexPage
