import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import rootReducer from './src/state/root-reducer'
import createStore from 'redux'

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const store = createStore(rootReducer)
  const ConnectedBody = () => <Provider store={store}>{bodyComponent}</Provider>
  replaceBodyHTMLString(renderToString(<ConnectedBody />))
}
