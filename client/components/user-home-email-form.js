import React from 'react'
import useForm from './form-validation/useForm-valChange'
import {validateEmail} from './form-validation/editprofile-form-errors'

const EmailForm = (props) => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validateEmail,
    editEmail,
    props.email
  )

  //validation happens during submit then calls this:
  function editEmail() {
    console.log('final', values)
    //this is where we would call the thunk
    console.log('hi')
  }

  return (
    <div>
      <form id="edit-account" onSubmit={handleSubmit}>
        <label>
          Email*
          <input
            type="text"
            name="email"
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

export default EmailForm
