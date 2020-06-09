import React from 'react'
import {connect} from 'react-redux'
import useForm from './form-validation/useForm-valChange'
import {validatePassword} from './form-validation/auth-form-errors'
import {editPassword} from '../store/user'

const PasswordForm = (props) => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validatePassword,
    editPasswordCB
  )

  async function editPasswordCB() {
    console.log('this is final', values)
    await props.editPassword(
      values.oldPassword,
      values.newPassword,
      values.newPassword2
    )

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
        {/* {isSucceeded && <p>Email has been successfully updated!</p>} */}
        {/* {error && error.response ? (
          <span className="pure-form-message">{error.response.data}</span>
        ) : null} */}
      </form>
    </div>
  )
}

const dispatchToProps = (dispatch) => ({
  editPassword: (oldPW, newPW, newPW2) =>
    dispatch(editPassword(oldPW, newPW, newPW2)),
})

const ConnectedPasswordForm = connect(null, dispatchToProps)(PasswordForm)

export default ConnectedPasswordForm
