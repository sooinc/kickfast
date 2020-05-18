/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import {CardElement} from '@stripe/react-stripe-js'

import {FormErrors} from '../components/checkout-form-errors'

export class CheckoutForm extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      ipAddress: '',
      formErrors: {email: '', ipAddress: ''},
      notValid: true,

      newIp: '',
      newIpDisable: false,

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
      case 'email':
        email = value.match(/^\S+@\S+\.\S+$/i)
        fieldValidateErrors.email = email ? '' : 'is invalid'
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
      if (formErrors[key] === isRequired || formErrors[key] === isInvalid) {
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
    const {email} = this.state
    let fieldValidateErrors = this.state.formErrors
    if (email.length < 1) {
      fieldValidateErrors.email = 'is required'
      this.setState({formErrors: fieldValidateErrors}, this.validateForm)
      return
    }

    const {stripe, elements} = this.props
    this.setState({processing: true})
    console.log('inside handleSubmit', this.props.clientSecret)
    const payload = await stripe.confirmCardPayment(this.props.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        // billing_details: {
        //   name: event.target.name.value,
        //   address: {
        //     line1: event.target.line1.value,
        //     line2: event.target.line2.value,
        //     city: event.target.city.value,
        //     state: event.target.state.value,
        //     postal_code: event.target.zip.value,
        //     country: event.target.country.value,
        //   },
        // },
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
          <FormErrors formErrors={this.state.formErrors} />
          <form id="payment-form" onSubmit={this.handleSubmit}>
            <h2>Billing Information</h2>
            <label>
              Name
              <input name="name" type="text" onChange={this.handleFormChange} />
            </label>
            <br />
            <label>
              Email
              <input
                name="email"
                value={this.state.email}
                type="text"
                onChange={this.handleFormChange}
                className="form-control"
              />
              {formErrors.email && (
                <p className="error-message">{formErrors.email}</p>
              )}
            </label>
            <br />
            <label>
              Address: Line1
              <input
                name="line1"
                type="text"
                onChange={this.handleFormChange}
              />
            </label>
            <br />
            <label>
              Address: Line2
              <input
                name="line2"
                type="text"
                onChange={this.handleFormChange}
              />
            </label>
            <br />
            <label>
              City
              <input name="city" type="text" onChange={this.handleFormChange} />
            </label>
            <br />
            <label>
              State
              <input name="state" onChange={this.handleFormChange} />
            </label>
            <br />
            <label>
              Zip
              <input name="zip" onChange={this.handleFormChange} />
            </label>
            <br />
            <label>
              Country
              <input name="country" onChange={this.handleFormChange} />
            </label>
            <br />

            <h2>Confirm IP Address</h2>
            <label>
              IP Address
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
