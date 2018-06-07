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
    <div className={styles.cardItem}>
      <p>{props.name}</p>
    </div>
    <div className={styles.cardItem}>
      <div>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span>Omzet: </span>
            <span> {props.statistics.totalRevenue.toFixed(0)}€</span>
          </li>
          <li className={styles.listItem}>
            <span>Aantallen: </span>
            <span>{props.statistics.totalSold.toFixed(0)}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
)

export default Card
