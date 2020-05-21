export function validateEmail(values, compare) {
  let errors = {}
  if (values.email) {
    let tempEmail = values.email.match(/^\S+@\S+\.\S+$/i)
    if (!tempEmail) {
      errors.email = 'Email address needs to be a valid email'
    } else if (compare === values.email) {
      errors.email =
        'Email address must be different from current email on account.'
    }
  } else {
    errors.email = 'Required field'
  }
  return errors
}

//needing to check if the oldPassword matches
//and if the newpassword matches the newpassword2 should be in backend
export function validatePassword(values) {
  let errors = {}

  if (!values.oldPassword) {
    errors.oldPassword = 'Required field'
  }

  if (values.newPassword) {
    if (values.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters'
    }
  } else {
    errors.newPassword = 'Required field'
  }

  if (values.newPassword2) {
    if (values.newPassword !== values.newPassword2) {
      errors.newPassword2 = 'Passwords do not match'
    }
  } else {
    errors.newPassword2 = 'Required field'
  }

  return errors
}
