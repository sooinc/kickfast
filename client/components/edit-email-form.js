/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import useForm from './form-validation/useForm-valChange'
import {validateEmail} from './form-validation/auth-form-errors'
import {editEmail} from '../store/user'

import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

const EmailForm = (props) => {
  const {values, errors, isDisabled, handleChange, handleSubmit} = useForm(
    validateEmail,
    editEmailCB,
    props.email
  )
  const {error, success} = props

  async function editEmailCB() {
    console.log('final', values)
    console.log('error', error)
    await props.editEmail(values.email)
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
          label="New Email"
          name="email"
          type="text"
          value={values.email || ''}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <Button
          variant="outlined"
          size="large"
          name="submit"
          type="submit"
          disabled={isDisabled || false}
        >
          Submit Changes
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

const mapDispatch = (dispatch) => ({
  editEmail: (email) => dispatch(editEmail(email)),
})

const ConnectedEmailForm = connect(mapState, mapDispatch)(EmailForm)

export default ConnectedEmailForm
