import React from 'react'
import Link from 'gatsby-link'
import _ from 'underscore'
import classNames from 'classnames'
import moment from 'moment';
import DatePicker from 'react-datepicker'

import styles from './index.module.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const lambdaURL =
  process.env.NODE_ENV === 'production' ? '/.netlify/functions' : '/localhost:9000'

class IndexPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dayreports: [],
      invoices: {}, // Reports legacy
      dates: {start: moment(), end: moment()},
      status: "Nog geen data aangevraagd",
      statusColor: "grey",
    }
    this.getInvoices = this.getInvoices.bind(this);
    this.createInvoice = this.createInvoice.bind(this);
    this.getReports = this.getReports.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleStartDateChange (startdate) {
    this.setState(prevState => {
        return {
          ...prevState,
          dates: {
            ...prevState.dates,
            start: startdate
          }
        }
    })
  }

  handleEndDateChange (enddate) {
    this.setState(prevState => {
        return {
          ...prevState,
          dates: {
            ...prevState.dates,
            end: enddate
          }
        }
    })
  }

  async getReports () {
    const payload = {
      dates: {
        start: this.state.dates.start.format(),
        end: this.state.dates.end.format()
      }
    }
    const options = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    };
    const apiUrl = `${lambdaURL}/lightspeed-admin-read-reports`;

    try {
      const res = await fetch(apiUrl, options);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      console.log("retrieved data from LS: ", data.body.lightspeed)

      data.body && this.setState({
        dayreport: data.body.dayreport,
        status: "Succesvolle update van sales",
        statusColor: "lightgreen"
      });

    } catch(err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: "red"
      })
    }
  }

  async getInvoices () {
    const options = {
      method: "GET"
    };
    const apiUrl = `${lambdaURL}/lightspeed-admin-read-reports-legacy`;

    try {

      const res = await fetch(apiUrl, options);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      data.body && this.setState({
        ...data.body.Item,
        status: "Succesvol geauthenticeerd en data opgehaald bij Lightspeed",
        statusColor: "lightgreen",
        invoices: data.body.invoices
      });

    } catch(err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: "red"
      })
    }
  }

  async createInvoice (invoice) {

    const payload = {
      ...invoice
    }
    const options = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    };
    const apiUrl = `${lambdaURL}/moneybird-admin-create-invoice`;

    try {

      const res = await fetch(apiUrl, options);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      data.body && this.setState({
        ...data.body.Item,
        status: "Succesvol verzonden met Moneybird",
        statusColor: "lightgreen"
      });

    } catch(err) {
      this.setState({
        status: `${JSON.stringify(err.body)}`,
        statusColor: "red"
      })
    }
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p>Admin voor Lightspeed API naar Moneybird API integratie</p>
          <h1>Status</h1>
          <p style={{backgroundColor: this.state.statusColor}} className={styles.statusBar}>{this.state.status}</p>
        </div>
        <div className={styles.content}>
          <h1>Reports</h1>
          <div className={styles.box}>
            <div className={styles.datepickerWrapper}>
              <DatePicker
                  className={styles.datepicker}
                  selected={this.state.dates.start}
                  startDate={this.state.dates.start}
                  endDate={this.state.dates.end}
                  onChange={this.handleStartDateChange}
                  selectsStart
              />
              <DatePicker
                  className={styles.datepicker}
                  selected={this.state.dates.end}
                  startDate={this.state.dates.start}
                  endDate={this.state.dates.end}
                  onChange={this.handleEndDateChange}
                  selectsEnd
              />
            </div>
            <button className={styles.button} onClick={this.getReports}>Verkrijg reports</button>
          </div>
          {/* <div className={styles.card}>
            <div className={styles.cardHeader}>
              <p className={styles.cardHeading}> Start: {this.state.dates.start.format("MM/DD/YYYY")} </p>
              <button className={classNames(styles.button, styles.buttonBlue)} onClick={this.createInvoice.bind(this, this.state.tax)}>Sla op in Moneybird</button>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardItem}>
                { Object.keys(this.state.dayreport.tax).map((key)=>{
                  return (
                    <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Belastingtype -</span> {key}: {this.state.dayreport.tax[key].amount} </p>
                )})}
              </div>
              <div className={styles.cardItem}>
                { Object.keys(this.state.dayreport.payments).map((key)=>{
                  return (
                    <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Betalingen -</span> {key}: {this.state.dayreport.payments[key].amount} </p>
                )})}
              </div>
            </div>
          </div> */}
        </div>
        <div className={styles.content}>
          <h1>Reports Legacy</h1>
          <button className={styles.button} onClick={this.getInvoices}>Verkrijg reports</button>
          { Object.values(this.state.invoices).reverse().map(((invoice, key)=>{
            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <p className={styles.cardHeading}> Datum: {invoice.tax[0].date} </p>
                  <button className={classNames(styles.button, styles.buttonBlue)} onClick={this.createInvoice.bind(this, invoice)}>Sla op in Moneybird</button>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardItem}>
                    { invoice.tax.map((tax, key)=>{
                      return (
                        <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Belastingtype -</span> {tax.taxClassName}: {tax.subtotal} </p>
                    )})}
                  </div>
                  <div className={styles.cardItem}>
                    { invoice.payments.map((payment, key)=>{
                      return (
                        <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Betalingen -</span> {payment.paymentTypeName}: {payment.amount} </p>
                    )})}
                  </div>
                </div>
              </div>)
          }))}
        </div>
      </div>
    )
  }
}

export default IndexPage
