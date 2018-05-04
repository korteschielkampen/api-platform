import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'

const client_id =
  '4c23f9e681c44d339359a38dc340522fae805ddab5e372c39762ef91c080179d'
const scope = 'employee:reports+employee:register_read'
const temporaryTokenLink = `https://cloud.lightspeedapp.com/oauth/authorize.php?response_type=code&client_id=${client_id}&scope=${scope}`

class IndexPage extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.cardHeader}>
            <a href={temporaryTokenLink}>
              <button className={styles.button}>
                {' '}
                Start integratie met Lightspeed Retail{' '}
              </button>
            </a>
          </div>
          <p>
            Deze link vraagt toegang tot uw account op Lightspeed Retail,
            gebruik deze link alleen als hij voor u is bedoeld.
          </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
