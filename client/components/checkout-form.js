import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import {checkout} from '../store/checkout'

export function CheckoutForm(props) {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  // const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  //by using hook, you tell react that your component
  // needs to do smth after render
  useEffect(() => {
    async function loadClientSecret() {
      await props.checkoutDispatch(props.cartItems)
      // await setClientSecret(props.clientSecret)
    }
    loadClientSecret()
  }, [])

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  const handleChange = (event) => {
    //listen for changes in the cardElement
    //and display any errors as the customer types their card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  const handleSubmit = async (event) => {
    console.log('hi')
    event.preventDefault()
    setProcessing(true)
    console.log('inside handleSubmit', props.clientSecret)
    const payload = await stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        // billing_details: {
        //   name: event.target.name.value,
        // },
      },
    })
    console.log('this is payload', payload)
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`)
      setProcessing(false)
    } else {
      setError(null)
      setProcessing(false)
      setSucceeded(true)
    }
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement
        id="card-element"
        options={cardStyle}
        onChange={handleChange}
      />
      {console.log('this is processing', processing)}
      {console.log('this is disabled', disabled)}
      {console.log('this is succeeded', succeeded)}
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
        type="submit"
      >
        <span id="button-text">
          {processing ? <div className="spinner" id="spinner"></div> : 'Pay'}
        </span>
      </button>

      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}

      {succeeded && (
        <p className={succeeded ? 'result-message' : 'result-message-hidden'}>
          Payment has been successfully processed!
        </p>
      )}
    </form>
  )
}

const stateToProps = (state) => ({
  cartItems: state.cart.products,
  clientSecret: state.checkout.secret,
})

const dispatchToProps = (dispatch) => ({
  checkoutDispatch: (cartItems) => dispatch(checkout(cartItems)),
})

const ConnectedCheckout = connect(stateToProps, dispatchToProps)(CheckoutForm)

export default ConnectedCheckout
