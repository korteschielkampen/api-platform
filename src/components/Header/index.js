import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'
import logo from './logo-full.png'

const Header = props => (
  <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.header}>
        <img src={logo} className={styles.logo} />
        <h1 >
          <Link className={styles.headerText} to="/">{props.siteTitle}</Link>
        </h1>
      </div>
    </div>
  </div>
)

export default Header
