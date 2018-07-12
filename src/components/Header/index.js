import React from 'react'
import Link from 'gatsby-link'

import styles from './index.module.css'
import logo from './logo-full.png'

const Header = props => (
  <div className={styles.container}>
    <div className={styles.content}>
      <nav className={styles.navigationContainer}>
        <ul className={styles.navigation}>
          <li className={styles.navigationItem}>
            <Link to="/artikelen/">Artikelen</Link>
          </li>
          <li className={styles.navigationItem}>Artikelgroepen</li>
          <li className={styles.navigationItem}>Verkopen</li>
          <li className={styles.navigationItem}>Inkomsten</li>
          <li className={styles.navigationItem}>
            <Link to="/configuration/">Config</Link>
          </li>
          <li className={styles.navigationItem}>
            <Link to="/oauth/">Oauth</Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
)

export default Header
