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
      dates: {start: moment(), end: moment()},
      status: "Nog geen data aangevraagd",
      statusColor: "grey",
    }
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.createInvoice = this.createInvoice.bind(this);
    this.getReports = this.getReports.bind(this);
    this.testAutomate = this.testAutomate.bind(this);
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

  async getReports (dayreport) {
    // Construct dates to get
    let datesArray = [];
    let days = Math.abs(this.state.dates.start.diff(this.state.dates.end, 'days')) + 1;
    let dayreports = await _.times(days, (index) => {
      let date = moment(this.state.dates.start).add(index, 'days').startOf("day").format();
      datesArray.push({
        date: date,
        lsRefresh: false
      });
    });

    // Check if one needs a refresh from Lightspeed
    datesArray = datesArray.map((date, key)=>{
      if (dayreport.date && moment(date.date).isSame(dayreport.date, "day")) {
        date.lsRefresh = true;
      }
      return date
    })

    // Send off the request
    const payload = {
      datesArray: datesArray
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

      data.body && this.setState({
        dayreports: data.body.dayreports,
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

  async createInvoice (dayreport) {
    const payload = {
      ...dayreport
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

  async testAutomate () {
    const options = {
      method: "GET"
    };
    const apiUrl = `${lambdaURL}/lightspeed-automated-invoice`;

    try {
      const res = await fetch(apiUrl, options);
      if (!res.ok) {throw await res.json();}
      let data = await res.json();

      data.body && this.setState({
        status: "Testing returns positive: 200",
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
            <button className={styles.button} onClick={this.getReports}>Verkrijg rapporten</button>
            <button className={styles.button} onClick={this.testAutomate}>Test automate</button>
          </div>
          {this.state.dayreports.map((dayreport, key)=>{
            return (<div key={key} className={styles.card}>
              <div className={styles.cardHeader}>
                <p className={styles.cardHeading}> Start: {moment(dayreport.date).format("MM/DD/YYYY")} </p>
                <p className={styles.cardHeadingText}> {dayreport.lsRequested ? "Lightspeed" : "DynamoDB"} </p>
                <button className={classNames(styles.button)} onClick={this.getReports.bind(this, dayreport)}>Refresh</button>
                <button className={classNames(styles.button, styles.buttonBlue)} onClick={this.createInvoice.bind(this, dayreport)}>Sla op in Moneybird</button>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardItem}>
                  { Object.keys(dayreport.tax).map((key)=>{
                    return (
                      <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Belastingtype -</span> {key}: {dayreport.tax[key].amount} </p>
                  )})}
                </div>
                <div className={styles.cardItem}>
                  { Object.keys(dayreport.payments).map((key)=>{
                    return (
                      <p key={key} className={styles.cardText}> <span style={{color: "grey"}}>Betalingen -</span> {key}: {dayreport.payments[key].amount} </p>
                  )})}
                </div>
              </div>
            </div>)
          })}
        </div>
      </div>
    )
  }
}

export default IndexPage
