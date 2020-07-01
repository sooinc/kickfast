/* eslint-disable complexity */
/* eslint-disable camelcase */
import React from 'react'
import {connect} from 'react-redux'
import {CardElement} from '@stripe/react-stripe-js'
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector'
import {getConfirmation} from '../store/checkout'
import {FormErrors} from '../components/form-validation/checkout-form-errors'
import ConnectedIpList from '../components/checkout-form-ip'

import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

export class CheckoutForm extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      line1: '',
      line2: '',
      city: '',
      region: '',
      zip: '',
      country: '',
      formErrors: {
        name: ' ',
        email: ' ',
        line1: ' ',
        city: ' ',
        region: ' ',
        country: ' ',
        zip: ' ',
      },
      notValid: true,

      succeeded: false,
      error: null,
      processing: false,
      disabled: true,
    }
    this.validateForm = this.validateForm.bind(this)
  }

  handleFormChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({[name]: value}, () => {
      this.validateField(name, value)
    })
  }

  handleDropDown = (value) => {
    let name
    if (value === 'CA' || value === 'US' || value === 'GB') {
      name = 'country'
    } else {
      name = 'region'
    }
    this.setState({[name]: value}, () => {
      this.validateField(name, value)
    })
  }

  //this is only for stripe CardElement onChange
  handleChange = (event) => {
    this.setState({disabled: event.empty})
    if (event.error) {
      this.setState({error: event.error.message})
    } else {
      this.setState({error: ''})
    }
  }

  validateField = (fieldName, value) => {
    let fieldValidateErrors = this.state.formErrors
    let email = this.state.email

    switch (fieldName) {
      case 'name':
        if (value.length > 1) fieldValidateErrors.name = ''
        break
      case 'email':
        email = value.match(/^\S+@\S+\.\S+$/i)
        fieldValidateErrors.email = email ? '' : 'Email is invalid.'
        break
      case 'line1':
        if (value.length > 1) fieldValidateErrors.line1 = ''
        break
      case 'city':
        if (value.length > 1) fieldValidateErrors.city = ''
        break
      case 'region':
        if (value.length > 1 && value !== 'Select Region')
          fieldValidateErrors.region = ''
        break
      case 'zip':
        if (value > 1) fieldValidateErrors.zip = ''
        break
      case 'country':
        if (value.length > 1) fieldValidateErrors.country = ''
        break
      default:
        break
    }
    this.setState({formErrors: fieldValidateErrors}, this.validateForm)
  }

  validateForm = () => {
    let ipAddress = this.props.user.ipAddress || []
    let isRequired = 'is required'
    let isInvalid = 'is invalid'
    let formErrors = this.state.formErrors

    if (ipAddress.length < 1) {
      this.setState({notValid: true})
      return
    }

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

  handleSubmit = async () => {
    event.preventDefault()
    const {email, name, line1, line2, city, region, country, zip} = this.state
    const {stripe, elements} = this.props
    this.setState({processing: true})
    console.log('inside handleSubmit', this.props.clientSecret)

    if (this.props.user.ipAddress.length < 1) {
      this.setState({
        error: `Payment failed: Need at least 1 Ip on User Account`,
      })
      this.setState({processing: false})
    } else {
      const payload = await stripe.confirmCardPayment(this.props.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
            address: {
              line1: line1,
              line2: line2,
              city: city,
              state: region,
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
        //confirmation - cart fulfilled. req cart deleted. billingEmail added to order detail
        await this.props.getConfirmationDispatch(email)
        console.log('Successful!')
      }
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
    } = this.state

    return (
      <form id="billing-form" onSubmit={this.handleSubmit}>
        <h2>Billing Information.</h2>
        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="Name"
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleFormChange}
        />
        {formErrors.name && <p className="error-message">{formErrors.name}</p>}
        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="Email"
          name="email"
          type="text"
          value={this.state.email}
          onChange={this.handleFormChange}
        />
        {formErrors.email && (
          <p className="error-message">{formErrors.email}</p>
        )}
        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="Address: Line 1"
          name="line1"
          type="text"
          value={this.state.line1}
          onChange={this.handleFormChange}
        />
        {formErrors.line1 && <p className="error-message">{formErrors.line}</p>}
        <TextField
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="Address: Line 2"
          name="line2"
          type="text"
          value={this.state.line2}
          onChange={this.handleFormChange}
        />
        {formErrors.line2 && (
          <p className="error-message">{formErrors.line2}</p>
        )}
        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="City"
          name="city"
          type="text"
          value={this.state.city}
          onChange={this.handleFormChange}
        />
        {formErrors.city && <p className="error-message">{formErrors.city}</p>}
        <br />
        <div className="country-dropdown">
          <label className="country-region-dropdown-label">
            Country:*
            <CountryDropdown
              name="country"
              value={this.state.country}
              whitelist={['US']}
              labelType="short"
              valueType="short"
              onChange={(val) => this.handleDropDown(val)}
              style={{
                marginLeft: 15,
                width: 200,
                height: 30,
                fontSize: 15,
              }}
            />
            {formErrors.country && (
              <p className="error-message">{formErrors.country}</p>
            )}
          </label>
        </div>

        <br />
        <div className="region-dropdown">
          <label className="country-region-dropdown-label">
            State:*
            <RegionDropdown
              name="region"
              country={this.state.country}
              value={this.state.region}
              countryValueType="short"
              labelType="short"
              valueType="short"
              onChange={(val, name) => this.handleDropDown(val, name)}
              style={{
                marginLeft: 32,
                width: 200,
                height: 30,
                fontSize: 15,
              }}
            />
            {formErrors.region && (
              <p className="error-message">{formErrors.region}</p>
            )}
          </label>
        </div>

        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="Zip Code"
          name="zip"
          type="text"
          value={this.state.zip}
          onChange={this.handleFormChange}
        />
        {formErrors.zip && <p className="error-message">{formErrors.zip}</p>}

        <div className="ip-form">
          <h2>Edit I.P. Address.</h2>
          <ConnectedIpList
            ipAddress={ipAddress}
            validateForm={this.validateForm}
          />
        </div>

        <div className="payment-form">
          <h2>Payment Information.</h2>
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
        </div>

        <button
          disabled={processing || disabled || notValid || succeeded}
          id="payment-submit-btn"
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
        {/* <FormErrors formErrors={this.state.formErrors} /> */}
      </form>
    )
  }
}

const stateToProps = (state) => ({
  user: state.user,
  error: state.checkout.error,
  status: state.checkout.status,
})

const dispatchToProps = (dispatch) => ({
  getConfirmationDispatch: (email) => dispatch(getConfirmation(email)),
})

const ConnectedCheckoutForm = connect(
  stateToProps,
  dispatchToProps
)(CheckoutForm)

export default ConnectedCheckoutForm
