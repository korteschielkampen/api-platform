import React from 'react'
import classNames from 'classnames'

import styles from './index.module.css'

export default props => {
  return <div className={styles.container}>{props.text}</div>
}
