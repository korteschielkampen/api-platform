import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import styles from './index.module.css'
import Button from '../Button'

export default props => {
  if (props.type === 'statistics') {
    let prettyPrint = {
      totalRevenue: { text: 'Omzet:', sign: '€' },
      totalProfit: { text: 'Winst:', sign: '€' },
      totalSold: { text: 'Verkocht:', sign: 'stuks' },
      totalStock: { text: 'Voorraad:', sign: 'stuks' },
      totalStockValue: { text: 'Voorraadwaarde:', sign: '€' },
      totalDuration: { text: 'Voorraadduur:', sign: 'weken' },
      totalReorderpoint: { text: 'Nabestelpunt:', sign: 'stuks' },
      totalReorderpointValue: { text: 'Nabestelwaarde:', sign: '€' },
    }

    return (
      <div className={styles.card}>
        <ul className={styles.list}>
          {!props.link && (
            <li
              className={classNames(
                styles.title,
                props.titlePadding && styles.titlePadding
              )}
            >
              {props.name}
            </li>
          )}
          {props.link && (
            <li>
              <a className={styles.title} href={props.link}>
                {props.name}
              </a>
            </li>
          )}
          {_.map(props.statistics, (value, key) => {
            return (
              <li key={key} className={styles.listItem}>
                <span>{prettyPrint[key].text} </span>
                <span className={styles.number}>
                  {(value && value.toFixed(0)) || '---'}
                  {prettyPrint[key].sign && ' ' + prettyPrint[key].sign}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  } else if (props.type === 'input') {
    return (
      <div className={styles.card}>
        <div className={styles.cardSection}>
          <p>{props.text}</p>
        </div>
        <div className={styles.cardSection}>
          {props.buttons &&
            props.buttons.map((action, key) => {
              return <Button key={key} options={action} />
            })}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.card}>
        <div className={styles.cardSection}>
          <p>{props.text}</p>
        </div>
        <div className={styles.cardSection}>
          {props.buttons &&
            props.buttons.map((action, key) => {
              return <Button key={key} options={action} />
            })}
        </div>
      </div>
    )
  }
}
