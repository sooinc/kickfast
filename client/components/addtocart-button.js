import React from 'react'
// import {useToasts} from 'react-toast-notifications'

const AddToCartButton = (props) => {
  let {productId, singleProduct, handleAddToCart, className} = props

  // const {addToast} = useToasts()
  return (
    <div>
      <button
        className={className}
        id={productId}
        type="button"
        onClick={
          (event) => handleAddToCart(event)
          // addToast(
          //   `${singleProduct.toUpperCase()} has been added to your cart!`,
          //   {
          //     appearance: 'success',
          //     autoDismiss: true
          //   },
          //   handleAddToCart(event)
          // )
        }
      >
        Add To Cart
      </button>
    </div>
  )
}

export default AddToCartButton
