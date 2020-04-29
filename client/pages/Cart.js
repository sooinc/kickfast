import React from 'react'
import {connect} from 'react-redux'

import {fetchCart} from '../store/cart'
import ProxyTile from '../components/proxy-tile'

export class Cart extends React.Component {
  componentDidMount() {
    this.props.fetchCartDispatch()
  }

  render() {
    switch (this.props.status) {
      case 'loading':
        return <div>loading...</div>
      case 'error':
        return <div>Couldn't load products. Please try again later.</div>
      case 'done':
        return (
          <div>
            <div>
              {this.props.proxies.map((proxy) => (
                <ProxyTile key={proxy.id} proxy={proxy} />
              ))}
            </div>
          </div>
        )
      default:
        console.error('unknown products status')
    }
  }
}

const stateToProps = (state) => ({
  status: state.cart.status,
  proxies: state.cart.products,
})

const dispatchToProps = (dispatch) => ({
  fetchCartDispatch: () => dispatch(fetchCart()),
})

const ConnectedCart = connect(stateToProps, dispatchToProps)(Cart)

export default ConnectedCart
