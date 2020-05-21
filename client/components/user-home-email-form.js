import React from 'react'
import useForm from './form-validation/useForm-valChange'
import {validateEmail} from './form-validation/auth-form-errors'

const EmailForm = (props) => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validateEmail,
    editEmail,
    props.email
  )

  //validation happens during submit then calls this:
  function editEmail() {
    console.log('final', values)
    //this is where we need to check if the new email exists in database
    //‘)DROP TABLE Users;—
    //how to check for mail server??
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

export default EmailForm
