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
          <div className="shop-container">
            <div id="home" className="home">
              <div className="home-images1">
                <img
                  className="home-single-image"
                  src="/images/sneakerA.png"
                  alt="sneaker1"
                  width="120"
                  height="120"
                />
                <img
                  className="home-single-image"
                  src="/images/sneaker2.png"
                  alt="sneaker2"
                  width="120"
                  height="120"
                />
              </div>
              <h1 className="home-headline">never miss a drop.</h1>
              <div className="home-images2">
                <img
                  className="home-single-image"
                  src="/images/sneaker4.png"
                  alt="sneaker3"
                  width="120"
                  height="120"
                />
                <img
                  className="home-single-image"
                  src="/images/sneaker3.png"
                  alt="sneaker4"
                  width="120"
                  height="120"
                />
              </div>
            </div>
            <div id="shop" className="shop">
              <h1 className="shop-headline">shop.</h1>
              <div className="proxy-tile-container">
                {this.props.proxies.map((proxy) => (
                  <ProxyTile key={proxy.id} proxy={proxy} />
                ))}
              </div>
            </div>
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
