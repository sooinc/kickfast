import React from 'react'
import useForm from './form-validation/useForm-valChange'
import {validatePassword} from './form-validation/auth-form-errors'

const PasswordForm = () => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validatePassword,
    editPassword
  )

  function editPassword() {
    console.log('this is final', values)
    //needing to check if the oldPassword matches
    //check if it's long enough
    //and if the newpassword matches the newpassword2 should be in backend
    console.log('bye')
  }

  return (
    <div>
      <form id="edit-account" onSubmit={handleSubmit}>
        <label>
          Old Password*
          <input
            name="oldPassword"
            type="password"
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
            name="newPassword"
            type="password"
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
            name="newPassword2"
            type="password"
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
