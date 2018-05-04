import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import netlifyIdentity from 'netlify-identity-widget'

import Header from '../components/Header'
import './index.css'

class TemplateWrapper extends React.Component {
  componentDidMount() {
    netlifyIdentity.init();
    netlifyIdentity.open("login");
  }

  render () {
    return (
      <div>
        <Helmet
          title={this.props.data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        />
        <Header siteTitle={this.props.data.site.siteMetadata.title}/>
        {this.props.children()}
      </div>
    )
  }
}

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
