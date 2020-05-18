/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import {CardElement} from '@stripe/react-stripe-js'

import {FormErrors} from '../components/checkout-form-errors'

export class CheckoutForm extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      newIp: '',
      newIpDisable: false,
      formErrors: {
        name: ' ',
        email: ' ',
        line1: ' ',
        city: ' ',
        state: ' ',
        country: ' ',
        zip: ' ',
      },
      notValid: true,

      succeeded: false,
      error: null,
      processing: false,
      disabled: true,
    }
  }

  handleFormChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    console.log('inside on change', value)
    this.setState({[name]: value}, () => {
      this.validateField(name, value)
    })
  }

  validateField = (fieldName, value) => {
    let fieldValidateErrors = this.state.formErrors
    let email = this.state.email
    let selectLen = document.getElementById('select').options.length

    switch (fieldName) {
      case 'name':
        if (value.length > 1) fieldValidateErrors.name = ''
        break
      case 'email':
        email = value.match(/^\S+@\S+\.\S+$/i)
        fieldValidateErrors.email = email ? '' : 'is invalid'
        break
      case 'line1':
        if (value.length > 1) fieldValidateErrors.line1 = ''
        break
      case 'city':
        if (value.length > 1) fieldValidateErrors.city = ''
        break
      case 'state':
        if (value.length > 1) fieldValidateErrors.state = ''
        break
      case 'zip':
        if (value > 1) fieldValidateErrors.zip = ''
        break
      case 'country':
        if (value.length > 1) fieldValidateErrors.country = ''
        break
      case 'newIp':
        if (selectLen >= 4) {
          fieldValidateErrors.ipAddress =
            'Not able to add more. Please select from the 3 IPs'
          this.setState({newIpDisable: true})
          this.setState({newIp: ''})
        }
        break
      case 'ip':
        if (value === '-- select --' || value === null) {
          fieldValidateErrors.ipAddress = 'is invalid'
        } else {
          fieldValidateErrors.ipAddress = ''
        }
        break
      default:
        break
    }
    this.setState({formErrors: fieldValidateErrors}, this.validateForm)
  }

  validateForm() {
    let isRequired = 'is required'
    let isInvalid = 'is invalid'
    let formErrors = this.state.formErrors
    for (let key in formErrors) {
      if (
        formErrors[key] === isRequired ||
        formErrors[key] === isInvalid ||
        formErrors[key] === ' '
      ) {
        this.setState({notValid: true})
        return
      }
    }
    this.setState({notValid: false})
  }

  addNewIp = (event) => {
    event.preventDefault()
    let newId = this.state.newIp

    if (newId.length) {
      let select = document.getElementById('select')
      let option = document.createElement('option')
      option.value = newId
      option.innerHTML = newId
      select.appendChild(option)
      option.selected = 'selected'
    }
    this.setState({newIp: ''})
  }

  handleChange = (event) => {
    this.setState({disabled: event.empty})
    if (event.error) {
      this.setState({error: event.error.message})
    } else {
      this.setState({error: ''})
    }
  }

  handleSubmit = async () => {
    event.preventDefault()
    const {email, name, line1, line2, city, state, country, zip} = this.state

    const {stripe, elements} = this.props
    this.setState({processing: true})
    console.log('inside handleSubmit', this.props.clientSecret)
    const payload = await stripe.confirmCardPayment(this.props.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
          address: {
            line1: line1,
            line2: line2,
            city: city,
            state: state,
            postal_code: zip,
            country: country,
          },
        },
      },
      receipt_email: email,
    })
    console.log('this is payload', payload)
    if (payload.error) {
      this.setState({error: `Payment failed ${payload.error.message}`})
      this.setState({processing: false})
    } else {
      this.setState({error: null})
      this.setState({processing: false})
      this.setState({succeeded: true})
    }
  }

  render() {
    const {ipAddress} = this.props.user
    const {
      processing,
      disabled,
      succeeded,
      error,
      notValid,
      formErrors,
      newIpDisable,
    } = this.state

    return (
      <div className="checkout">
        <div className="checkout-form">
          <form id="payment-form" onSubmit={this.handleSubmit}>
            <h2>Billing Information</h2>
            <label>
              Name*
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleFormChange}
              />
              {formErrors.name && (
                <p className="error-message">{formErrors.name}</p>
              )}
            </label>
            <br />
            <label>
              Email*
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.handleFormChange}
              />
              {formErrors.email && (
                <p className="error-message">{formErrors.email}</p>
              )}
            </label>
            <br />
            <label>
              Address: Line1*
              <input
                type="text"
                name="line1"
                value={this.state.line1}
                onChange={this.handleFormChange}
              />
              {formErrors.line1 && (
                <p className="error-message">{formErrors.line1}</p>
              )}
            </label>
            <br />
            <label>
              Address: Line2
              <input
                type="text"
                name="line2"
                value={this.state.line2}
                onChange={this.handleFormChange}
              />
              {formErrors.line2 && (
                <p className="error-message">{formErrors.line2}</p>
              )}
            </label>
            <br />
            <label>
              City*
              <input
                type="text"
                name="city"
                value={this.state.city}
                onChange={this.handleFormChange}
              />
              {formErrors.city && (
                <p className="error-message">{formErrors.city}</p>
              )}
            </label>
            <br />
            <label>
              State*
              <input
                type="text"
                name="state"
                value={this.state.state}
                onChange={this.handleFormChange}
              />
              {formErrors.state && (
                <p className="error-message">{formErrors.state}</p>
              )}
            </label>
            <br />
            <label>
              Zip*
              <input
                type="text"
                name="zip"
                value={this.state.zip}
                onChange={this.handleFormChange}
              />
              {formErrors.zip && (
                <p className="error-message">{formErrors.zip}</p>
              )}
            </label>
            <br />
            <label>
              Country*
              <input
                type="text"
                name="country"
                value={this.state.country}
                onChange={this.handleFormChange}
              />
              {formErrors.country && (
                <p className="error-message">{formErrors.country}</p>
              )}
            </label>
            <br />

            <h2>Confirm IP Address</h2>
            <label>
              IP Address*
              <select id="select" name="ip" onChange={this.handleFormChange}>
                <option value={null}>-- select --</option>
                {ipAddress
                  ? ipAddress.map((ip) => {
                      return <option value={ip}>{ip}</option>
                    })
                  : null}
              </select>
              {ipAddress && ipAddress.length >= 3 ? null : (
                <div>
                  <input
                    id="newIp"
                    name="newIp"
                    type="text"
                    value={this.state.newIp}
                    onChange={this.handleFormChange}
                  />
                  <button
                    id="addNewIp"
                    type="button"
                    onClick={this.addNewIp}
                    disabled={newIpDisable}
                  >
                    Add
                  </button>
                </div>
              )}
              {formErrors.ipAddress && (
                <p className="error-message">{formErrors.ipAddress}</p>
              )}
            </label>
            <br />

            <h2>Payment Information</h2>
            <CardElement
              id="card-element"
              options={{
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
              }}
              name="cardElement"
              onChange={this.handleChange}
            />

            <button
              disabled={processing || disabled || notValid || succeeded}
              id="submit"
              type="submit"
            >
              <span id="button-text">
                {processing ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  'Pay'
                )}
              </span>
            </button>

            {error && (
              <div className="card-error" role="alert">
                {error}
              </div>
            )}

            {succeeded && (
              <p
                className={
                  succeeded ? 'result-message' : 'result-message-hidden'
                }
              >
                Payment has been successfully processed!
              </p>
            )}
          </form>
          <FormErrors formErrors={this.state.formErrors} />
        </div>
      </div>
    )
  }
}

const stateToProps = (state) => ({
  user: state.user,
})

const ConnectedCheckoutForm = connect(stateToProps, null)(CheckoutForm)

export default ConnectedCheckoutForm
