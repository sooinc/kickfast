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
//and if the newpassword matches the newpassword2 should be in backend as well
export function validatePassword(values) {
  let errors = {}

  if (!values.oldPassword) {
    errors.oldPassword = ' '
  }

  if (values.newPassword) {
    if (values.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters'
    }
  } else {
    errors.newPassword = ' '
  }

  if (values.newPassword2) {
    if (values.newPassword !== values.newPassword2) {
      errors.newPassword2 = 'Passwords do not match'
    }
  } else {
    errors.newPassword2 = ' '
  }
  return errors
}

export function validateSignup(values) {
  let errors = {}

  if (!values.name) {
    errors.name = ' '
  }

  if (values.email) {
    let tempEmail = values.email.match(/^\S+@\S+\.\S+$/i)
    if (!tempEmail) {
      errors.email = 'Email address needs to be a valid email'
    }
  } else {
    errors.email = ' '
  }

  if (values.password) {
    if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
  } else {
    errors.password = ' '
  }

  return errors
}
