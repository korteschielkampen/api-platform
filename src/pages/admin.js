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
      sales: {},
      taxrates: {},
      date: moment(),
      status: "Nog geen data aangevraagd",
      statusColor: "grey",
      invoices: {}
    }
    this.getInvoices = this.getInvoices.bind(this);
    this.createInvoice = this.createInvoice.bind(this);
    this.updateSales = this.updateSales.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(date) {
    this.setState({
      date: date
    })
  }

  async updateSales () {
    const payload = {
      date: this.state.date.format()
    }
    const options = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    };
    const apiUrl = `${lambdaURL}/lightspeed-admin-read-salesday`;

    try {
      const res = await fetch(apiUrl, options);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      console.log("retrieved data from LS: ", data.body.lightspeed)

      data.body && this.setState({
        sales: {...data.body.sales.sales},
        taxrates: data.body.taxrates,
        payments: data.body.payments,
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
    const apiUrl = `${lambdaURL}/lightspeed-admin-read-reports`;

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
    console.log(this.state)
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p>Admin voor Lightspeed API naar Moneybird API integratie</p>
          <h1>Status</h1>
          <p style={{backgroundColor: this.state.statusColor}} className={styles.statusBar}>{this.state.status}</p>
        </div>
        <div className={styles.content}>
          <h1>Sales</h1>
          <div className={styles.box}>
            <DatePicker
                className={styles.datepicker}
                selected={this.state.date}
                onChange={this.handleDateChange}
            />
            <button className={styles.button} onClick={this.updateSales}>Update sales</button>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <p className={styles.cardHeading}> Datum: {this.state.date.format("MM/DD/YYYY")} </p>
              <button className={classNames(styles.button, styles.buttonBlue)} onClick={this.createInvoice.bind(this, this.state.taxrates)}>Sla op in Moneybird</button>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardItem}>
                { Object.keys(this.state.taxrates).map((key)=>{
                  return (
                    <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Belastingtype -</span> {key}: {this.state.taxrates[key].amount} </p>
                )})}
              </div>
              <div className={styles.cardItem}>
                {/* { invoice.payments.map((payment, key)=>{
                  return (
                    <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Betalingen -</span> {payment.paymentTypeName}: {payment.amount} </p>
                )})} */}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <h1>Reports</h1>
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
