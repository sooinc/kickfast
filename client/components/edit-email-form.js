import React, {useState} from 'react'
import {connect} from 'react-redux'
import useForm from './form-validation/useForm-valChange'
import {validateEmail} from './form-validation/auth-form-errors'
import {editEmail} from '../store/user'

const EmailForm = (props) => {
  const {
    values,
    errors,
    isDisabled,
    isSucceeded,
    handleChange,
    handleSubmit,
  } = useForm(validateEmail, editEmailCB, props.email)
  const {error} = props
  // const [succeeded, setSucceeded] = useState(false)

  async function editEmailCB() {
    console.log('final', values)
    await props.editEmail(values.email)
    console.log('error', error)
    console.log('isSucceeded', isSucceeded)
    // if (error && error.response) {
    //   setSucceeded(false)
    // } else {
    //   setSucceeded(true)
    // }
  }

  return (
    <div>
      <form id="edit-account" onSubmit={handleSubmit}>
        <label>
          Email*
          <input
            name="email"
            type="text"
            value={values.email || ''}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </label>
        <button name="submit" type="submit" disabled={isDisabled || false}>
          Submit Changes
        </button>
        {console.log('isSucceeded', isSucceeded)}
        {isSucceeded && <p>Email has been successfully updated!</p>}
        {error && error.response ? (
          <span className="pure-form-message">{error.response.data}</span>
        ) : null}
      </form>
    </div>
  )
}

const mapState = (state) => ({
  error: state.user.error,
})

const mapDispatch = (dispatch) => ({
  editEmail: (email) => dispatch(editEmail(email)),
})

const ConnectedEmailForm = connect(mapState, mapDispatch)(EmailForm)

export default ConnectedEmailForm
