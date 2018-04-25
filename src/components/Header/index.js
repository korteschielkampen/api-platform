import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'

const Header = (props) => (
  <div className={styles.container}>
    <div className={styles.content}>
      <h1>
        <Link to="/">
          { props.siteTitle }
        </Link>
      </h1>
    </div>
  </div>
)

export default Header
