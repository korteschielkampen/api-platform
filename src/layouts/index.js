import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/Header'
import './index.css'
import './typography.css'

const TemplateWrapper = ({ data, children }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        {
          name: 'description',
          content:
            'Platform waarin integraties en algoritmes beheerd kunnen worden en analytics gebruikt',
        },
        { name: 'keywords', content: 'Analytics, integraties, algoritme' },
      ]}
      link={[
        {
          rel: 'shortcut icon',
          href: '/static/favicon.png',
          type: 'image/png',
        },
      ]}
    />
    <Header siteTitle={data.site.siteMetadata.title} />
    {children()}
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
