/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import useForm from './form-validation/useForm-valChange'
import {validatePassword} from './form-validation/auth-form-errors'
import {editPassword} from '../store/user'

import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

const PasswordForm = (props) => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validatePassword,
    editPasswordCB
  )
  const {error, success} = props

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
      <form className="edit-form" onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="Old Password"
          name="oldPassword"
          type="password"
          value={values.oldPassword || ''}
          onChange={handleChange}
        />
        {errors.oldPassword && (
          <p className="error-message">{errors.oldPassword}</p>
        )}
        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="New Password"
          name="newPassword"
          type="password"
          value={values.newPassword || ''}
          onChange={handleChange}
        />
        {errors.newPassword && (
          <p className="error-message">{errors.newPassword}</p>
        )}
        <TextField
          required
          fullWidth
          id="outlined-size-normal"
          variant="outlined"
          margin="normal"
          label="Re-type New Password"
          name="newPassword2"
          type="password"
          value={values.newPassword2 || ''}
          onChange={handleChange}
        />
        {errors.newPassword2 && (
          <p className="error-message">{errors.newPassword2}</p>
        )}
        <Button
          variant="outlined"
          size="large"
          type="submit"
          disabled={isDisabled || false}
        >
          Submit Change
        </Button>

        {error && error.response ? (
          <span className="error-message">{error.response.data}</span>
        ) : null}

        {success && (
          <p className={success ? 'result-message' : 'result-message-hidden'}>
            {success ? success : null}
          </p>
        )}
      </form>
    </div>
  )
}

const mapState = (state) => ({
  error: state.user.error,
  success: state.user.success,
})

const dispatchToProps = (dispatch) => ({
  editPassword: (oldPW, newPW, newPW2) =>
    dispatch(editPassword(oldPW, newPW, newPW2)),
})

const ConnectedPasswordForm = connect(mapState, dispatchToProps)(PasswordForm)

export default ConnectedPasswordForm
