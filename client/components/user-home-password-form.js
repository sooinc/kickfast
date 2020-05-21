import React from 'react'
import useForm from './form-validation/useForm-valChange'
import {validatePassword} from './form-validation/editprofile-form-errors'

const PasswordForm = () => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validatePassword,
    editPassword
  )

  function editPassword() {
    console.log('this is final', values)
    //this is where we would call the thunk
    console.log('bye')
  }

  return (
    <div>
      <form id="edit-account" onSubmit={handleSubmit}>
        <label>
          Old Password*
          <input
            type="password"
            name="oldPassword"
            value={values.oldPassword || ''}
            onChange={handleChange}
          />
          {errors.oldPassword && (
            <p className="error-message">{errors.oldPassword}</p>
          )}
        </label>
        <label>
          New Password*
          <input
            type="password"
            name="newPassword"
            value={values.newPassword || ''}
            onChange={handleChange}
          />
          {errors.newPassword && (
            <p className="error-message">{errors.newPassword}</p>
          )}
        </label>
        <label>
          Re-type New Password*
          <input
            type="password"
            name="newPassword2"
            value={values.newPassword2 || ''}
            onChange={handleChange}
          />
          {errors.newPassword2 && (
            <p className="error-message">{errors.newPassword2}</p>
          )}
        </label>
        <button name="submit" type="submit" disabled={isDisabled || false}>
          Submit Changes
        </button>
      </form>
    </div>
  )
}

export default PasswordForm
