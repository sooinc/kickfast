import React from 'react'

const CartToast = ({appearance, children}) => (
  <div
    style={{
      width: 300,
      height: 25,
      padding: 10,
      marginTop: 95,
      borderRadius: 5,
      boxShadow: '1px 1px 2px 2px gray',
      background: appearance === 'success' ? '#e2b4bd' : 'red',
      color: 'white',
      fontFamily: 'roboto',
      fontSize: 15,
    }}
  >
    {children}
  </div>
)

export default CartToast
