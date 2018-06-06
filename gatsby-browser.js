import React from 'react'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import rootReducer from './src/state/root-reducer'

exports.replaceRouterComponent = ({ history }) => {
  const store = createStore(rootReducer)

  const ConnectedRouterWrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  )

  return ConnectedRouterWrapper
}

exports.onClientEntry = () => {
  require('babel-polyfill')
}
