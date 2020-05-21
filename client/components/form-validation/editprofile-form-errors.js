//being validated when submitted (useForm-valSubmit)
export function validateEmail(name, values, compare) {
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

// //being validated during onchange (useForm-valChange)
// export function validatePassword(name, values) {
//   let errors = {}
//   switch (name) {
//     case 'oldPassword':
//       if (values.)
//       break
//     case 'newPassword':
//       //something
//       break
//     case 'newPassword2':
//       //somethign
//       break
//     default:
//       break
//   }
//   return errors
// }
