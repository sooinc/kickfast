import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import {ToastProvider} from 'react-toast-notifications'
import CartToast from './components/cart-toast'

import './index.css'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ToastProvider components={{Toast: CartToast}} placement="bottom-right">
        <App />
      </ToastProvider>
    </Router>
  </Provider>,
  document.getElementById('app')
)
