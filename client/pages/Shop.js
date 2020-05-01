import React from 'react'
import {connect} from 'react-redux'

import '../css/shop.css'
import {fetchAllProxy} from '../store/shop'
import ProxyTile from '../components/proxy-tile'

export class Shop extends React.Component {
  async componentDidMount() {
    await this.props.fetchAllProxyDispatch()
  }

  render() {
    switch (this.props.status) {
      case 'loading':
        return <div>loading...</div>
      case 'error':
        return <div>Couldn't load products. Please try again later.</div>
      case 'done':
        return (
          <div className="proxy-tile-container">
            {this.props.proxies.map((proxy) => (
              <ProxyTile key={proxy.id} proxy={proxy} />
            ))}
          </div>
        )
      default:
        console.error('unknown products status')
    }
  }
}

const stateToProps = (state) => ({
  status: state.proxyReducer.status,
  proxies: state.proxyReducer.proxies,
})

const dispatchToProps = (dispatch) => ({
  fetchAllProxyDispatch: () => dispatch(fetchAllProxy()),
})

const ConnectedShop = connect(stateToProps, dispatchToProps)(Shop)

export default ConnectedShop
