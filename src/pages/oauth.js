import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'
import Card from '../components/Card'

const providers = [
  {
    name: 'Lightspeed',
    client_id:
      '4c23f9e681c44d339359a38dc340522fae805ddab5e372c39762ef91c080179d',
    scope:
      'employee:reports+employee:register_read+employee:inventory+employee:admin_shops',
    get link() {
      return `https://cloud.lightspeedapp.com/oauth/authorize.php?response_type=code&client_id=${
        this.client_id
      }&scope=${this.scope}`
    },
  },
  {
    name: 'Slack',
    client_id: '306795199399.363120627526',
    scope: 'chat:write+commands+files:write',
    redirect_uri: encodeURI(
      'https://integration-platform.korteschielkampen.nl/slack-redirect/'
    ),
    get link() {
      return `https://slack.com/oauth/authorize?client_id=${
        this.client_id
      }&redirect_uri=${this.redirect_uri}&response_type=code&scope=${
        this.scope
      }`
    },
  },
  {
    name: 'Moneybird',
    client_id: '64e1b03a820d8c9585cb7521cbc8605e',
    scope: 'sales_invoices+bank',
    redirect_uri: encodeURI(
      'https://integration-platform.korteschielkampen.nl/moneybird-redirect/'
    ),
    get link() {
      return `https://moneybird.com/oauth/authorize?client_id=${
        this.client_id
      }&redirect_uri=${this.redirect_uri}&response_type=code&scope=${
        this.scope
      }`
    },
  },
]

class IndexPage extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Oauth</h1>
          <div className={styles.cards}>
            {providers.map((provider, key) => {
              return (
                <div key={key} className={styles.cardSmall}>
                  <Card type="oauth" provider={provider} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
