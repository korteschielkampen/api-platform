import React from 'react'
import classNames from 'classnames'

import styles from './index.module.css'
import Button from '../Button'

export default props => {
  if (props.type === 'statistics') {
    console.log(props.statistics)
    return (
      <div className={styles.card}>
        <ul className={styles.list}>
          {!props.link && <li className={styles.title}>{props.name}</li>}
          {props.link && (
            <li>
              <a className={styles.title} href={props.link}>
                {props.name}
              </a>
            </li>
          )}
          <li className={styles.listItem}>
            <span>Omzet: </span>
            <span className={styles.number}>
              {(props.statistics && props.statistics.totalRevenue.toFixed(0)) ||
                '---'}€
            </span>
          </li>
          <li className={styles.listItem}>
            <span>Winst: </span>
            <span className={styles.number}>
              {(props.statistics &&
                props.statistics.totalProfit &&
                props.statistics.totalProfit.toFixed(0)) ||
                '--- '}
            </span>
          </li>
          <li className={styles.listItem}>
            <span>Verkocht: </span>
            <span className={styles.number}>
              {(props.statistics && props.statistics.totalSold.toFixed(0)) ||
                '--- '}
            </span>
          </li>
          <li className={styles.listItem}>
            <span>Voorraad: </span>
            <span className={styles.number}>
              {(props.statistics &&
                props.statistics.totalStock &&
                props.statistics.totalStock.toFixed(0)) ||
                '--- '}
            </span>
          </li>
          <li className={styles.listItem}>
            <span>Waarde: </span>
            <span className={styles.number}>
              {(props.statistics &&
                props.statistics.totalStockValue &&
                props.statistics.totalStockValue.toFixed(0)) ||
                '--- '}€
            </span>
          </li>
        </ul>
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
