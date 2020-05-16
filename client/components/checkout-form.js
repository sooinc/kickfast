import React, {useState} from 'react'
import {connect} from 'react-redux'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'

export function CheckoutForm(props) {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const stripe = useStripe()
  const elements = useElements()

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
    console.log('event error', event.error)
    console.log('event empty', event.empty)
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setProcessing(true)
    console.log('inside handleSubmit', props.clientSecret)
    const payload = await stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: event.target.name.value,
          address: {
            line1: event.target.line1.value,
            line2: event.target.line2.value,
            city: event.target.city.value,
            state: event.target.state.value,
            postal_code: event.target.zip.value,
            country: event.target.country.value,
          },
        },
      },
      receipt_email: event.target.email.value,
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
      <h2>Billing Information</h2>
      <label>
        Name
        <input name="name" type="text" onChange={handleChange} />
      </label>
      <br />
      <label>
        Email
        <input name="email" type="text" onChange={handleChange} />
      </label>
      <br />
      <label>
        Address: Line1
        <input name="line1" type="text" onChange={handleChange} />
      </label>
      <br />
      <label>
        Address: Line2
        <input name="line2" type="text" onChange={handleChange} />
      </label>
      <br />
      <label>
        City
        <input name="city" type="text" onChange={handleChange} />
      </label>
      <br />
      <label>
        State
        <input name="state" onChange={handleChange} />
      </label>
      <br />
      <label>
        Zip
        <input name="zip" onChange={handleChange} />
      </label>
      <br />
      <label>
        Country
        <input name="country" onChange={handleChange} />
      </label>
      <br />

      <h2>Confirm IP Address</h2>
      <label>
        IP Address
        <input name="ip" onChange={handleChange} />
      </label>
      <br />

      <h2>Payment Information</h2>
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
  user: state.user,
})

const ConnectedCheckoutForm = connect(stateToProps, null)(CheckoutForm)

export default ConnectedCheckoutForm
