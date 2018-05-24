import React from 'react'
import Link from 'gatsby-link'
import classNames from 'classnames'

import styles from './index.module.css'

const client_id = '306795199399.363120627526'
const scope = 'chat:write+commands+files:write'
const redirect_uri = encodeURI(
  'https://integration-platform.korteschielkampen.nl/slack-redirect/'
)
const temporaryTokenLink = `https://slack.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`

class IndexPage extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.cardHeader}>
            <a href={temporaryTokenLink}>
              <button
                className={classNames(styles.button, styles.buttonOrange)}
              >
                Start integratie met Slack
              </button>
            </a>
          </div>
          <p>
            Deze link vraagt toegang tot uw account op Slack, gebruik deze link
            alleen als hij voor u is bedoeld.
          </p>
        </div>
      </div>
    )
  }
}

export default IndexPage
