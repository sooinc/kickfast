import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import './index.css'

import CartToast from './components/cart-toast'
import {ToastProvider} from 'react-toast-notifications'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ToastProvider components={{Toast: CartToast}} placement="top-center">
        <App />
      </ToastProvider>
    </Router>
  </Provider>,
  document.getElementById('app')
)
