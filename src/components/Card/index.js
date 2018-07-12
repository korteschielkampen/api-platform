import React from 'react'
import classNames from 'classnames'

import styles from './index.module.css'

const Card = props => {
  if (props.type === 'statistics') {
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
            <span>Aantallen: </span>
            <span className={styles.number}>
              {(props.statistics && props.statistics.totalSold.toFixed(0)) ||
                '--- '}
            </span>
          </li>
        </ul>
      </div>
    )
  } else if (props.type === 'oauth') {
    return (
      <div className={styles.card}>
        <p>{props.provider.name}</p>
        <a href={props.provider.link}>
          <button className={styles.button}>Start</button>
        </a>
      </div>
    )
  }
}

export default Card
