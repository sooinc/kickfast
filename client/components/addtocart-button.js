import React from 'react'
import {Button} from '@material-ui/core'
// import {useToasts} from 'react-toast-notifications'

const AddToCartButton = (props) => {
  let {productId, singleProduct, handleAddToCart, className} = props

  // const {addToast} = useToasts()
  return (
    <div>
      <Button
        variant="outlined"
        size="small"
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
      </Button>
    </div>
  )
}

export default AddToCartButton
