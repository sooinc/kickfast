import React from 'react'
import {connect} from 'react-redux'
import useForm from './form-validation/useForm-valChange'
import {validateEmail} from './form-validation/auth-form-errors'
import {editEmail} from '../store/user'

const EmailForm = (props) => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validateEmail,
    editEmail,
    props.email
  )

  //validation happens during submit then calls this:
  function editEmail() {
    console.log('final', values)
    props.editEmail(values.email)
    //even need handle even if there is an error
    //need to make error doesnt show
    values.email = ''

    console.log('hi')
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
      </form>
    </div>
  )
}

const dispatchToProps = (dispatch) => ({
  editEmail: (email) => dispatch(editEmail(email)),
})

const ConnectedEmailForm = connect(null, dispatchToProps)(EmailForm)

export default ConnectedEmailForm
