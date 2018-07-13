import React from 'react'
import classNames from 'classnames'

import styles from './index.module.css'

export default props => {
  if (props.options.link) {
    return (
      <a href={props.options.link}>
        <button className={styles.button}>{props.options.text}</button>
      </a>
    )
  } else if (props.options.handler) {
    return (
      <button className={styles.button} onClick={props.options.handler}>
        {props.options.text}
      </button>
    )
  }
}
