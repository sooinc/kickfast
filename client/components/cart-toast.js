import React from 'react'

const CartToast = ({appearance, children}) => (
  <div
    style={{
      width: 300,
      height: 30,
      padding: 15,
      marginBottom: 120,
      borderRadius: 5,
      background: appearance === 'success' ? '#e2b4bd' : 'red',
      color: 'white',
      fontFamily: 'roboto',
      fontSize: 15,
      // transitionProperty: 'width',
      // transitionDuration: 0.5,
      // transitionTimingFunction: 'ease-in',
      // transitionDelay: 0.5,
    }}
  >
    {children}
  </div>
)

export default CartToast
