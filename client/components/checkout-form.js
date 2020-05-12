import React, {useState, useEffect} from 'react'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'

export default function CheckoutForm() {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  //by using hook, you tell react that your component
  // needs to do smth after render
  useEffect(() => {
    //thunk to call post request to create paymentIntent
    //then set ClientSecret
  })

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

  const handleChange = async (event) => {
    //listen for changes in the cardElement
    //and display any errors as the customer types their card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setProcessing(true)

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElements(CardElement),
        billing_details: {
          name: event.target.name.value,
        },
      },
    })
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

      <button
        disabled={processing || disabled || succeeded}
        id="submit"
        type="button"
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

      <p className={succeeded ? 'result-message' : 'result-message-hidden'}>
        Payment has been successfully processed!
      </p>
    </form>
  )
}
