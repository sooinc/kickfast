import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class ProxyTile extends React.Component {
  constructor() {
    super()
  }

  render() {
    const {proxy} = this.props
    const toProxy = `/shop/${proxy.id}`

    return (
      <div className="card card-hover product-card">
        <div className="product-card-image"></div>
        <div className="product-card-body">
          <Link to={toProxy} className="product-link">
            {proxy.name}
          </Link>
          <Link to={toProxy} className="price">
            ${proxy.price}
          </Link>
        </div>
      </div>
    )
  }
}

export default ProxyTile
