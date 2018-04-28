import React from 'react'
import Link from 'gatsby-link'
import classNames from 'classnames'

import styles from './index.module.css'

const client_id = "";
const scope = ""
const temporaryTokenLink = `${client_id}&scope=${scope}`

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
