import React from 'react'
import Link from 'gatsby-link'
import queryString from 'query-string'

import styles from './index.module.css'
import Card from '../components/Card'

const lambdaURL =
  process.env.NODE_ENV === 'production'
    ? '/.netlify/functions'
    : '/localhost:9000'

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
      }&scope=${this.scope}&state=${this.name}`
    },
  },
  {
    name: 'Slack',
    client_id: '306795199399.363120627526',
    scope: 'chat:write+commands+files:write',
    redirect_uri: encodeURI(
      'https://integration-platform.korteschielkampen.nl/oauth/'
    ),
    get link() {
      return `https://slack.com/oauth/authorize?client_id=${
        this.client_id
      }&redirect_uri=${this.redirect_uri}&response_type=code&scope=${
        this.scope
      }&state=${this.name}`
    },
  },
  {
    name: 'Moneybird',
    client_id: '64e1b03a820d8c9585cb7521cbc8605e',
    scope: 'sales_invoices+bank',
    redirect_uri: encodeURI(
      'https://integration-platform.korteschielkampen.nl/oauth/'
    ),
    get link() {
      return `https://moneybird.com/oauth/authorize?client_id=${
        this.client_id
      }&redirect_uri=${this.redirect_uri}&response_type=code&scope=${
        this.scope
      }&state=${this.name}`
    },
  },
]

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: {
        text: 'Geen Status',
        color: 'grey',
        sign: 'dash',
      },
    }
    this.saveAuthData = this.saveAuthData.bind(this)
  }

  componentDidMount() {
    let { code, state } = queryString.parse(this.props.location.search)
    code &&
      state &&
      this.setState(
        {
          status: {
            text: 'Verwerken',
            color: 'grey',
            sign: 'loading',
          },
          data: {
            oauth: {
              code: code,
              state: state,
            },
          },
        },
        this.saveAuthData
      )
  }

  async saveAuthData() {
    try {
      let apiUrl = `${lambdaURL}/oauth?${queryString.stringify(
        this.state.data.oauth
      )}`
      let options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
      const res = await fetch(apiUrl, options)
      if (!res.ok) {
        console.log('Errored')
        throw await res.json()
      } else {
        let data = await res.json()
        console.log('Succes')
        this.setState({
          status: {
            text: 'Succesvol geauthenticeerd',
            color: 'green',
            sign: 'done',
          },
        })
      }
    } catch (err) {
      this.setState({
        status: {
          text: `Authenticatie mislukt: ${JSON.stringify(err.body)}`,
          color: 'red',
          sign: 'cross',
        },
      })
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Oauth</h1>
          <div className={styles.cards}>
            {providers.map((provider, key) => {
              return (
                <div key={key} className={styles.cardSmall}>
                  <Card
                    text={provider.name}
                    button={{ text: 'start', link: provider.link }}
                  />
                </div>
              )
            })}
            <Card text={this.state.status.text} />
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
