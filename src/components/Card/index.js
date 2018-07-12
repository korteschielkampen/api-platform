import React from 'react'
import classNames from 'classnames'

import styles from './index.module.css'

const Card = props => (
  <div
    className={classNames(
      styles.card,
      props.type == 'important' && styles.cardImportant
    )}
  >
    <ul className={styles.list}>
      {!props.link && <li className={styles.title}>{props.name}</li>}
      {props.link && (
        <li>
          <a href={props.link}>{props.name}</a>
        </li>
      )}
      <li className={styles.listItem}>
        <span>Omzet: </span>
        <span className={styles.title}>
          {props.statistics && props.statistics.totalRevenue.toFixed(0)}€
        </span>
      </li>
      <li className={styles.listItem}>
        <span>Aantallen: </span>
        <span className={styles.title}>
          {props.statistics && props.statistics.totalSold.toFixed(0)}
        </span>
      </li>
    </ul>
  </div>
)

export default Card
