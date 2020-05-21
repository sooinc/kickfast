import {useState, useEffect} from 'react'

const useForm = (validate, callback, compare = null) => {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  //listens to any changes to error; if there are no keys in error object, call the callback
  //NOTE: because error starts with 0 keys, we must also check to see if isSubmitting is set to true
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback()
    }
  }, [errors])

  //does not handle the callback anymore - it handles the validation
  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    setIsSubmitting(true)
    setErrors(validate(values, compare))
    console.log('this is errors', errors)
  }

  const handleChange = (event) => {
    event.persist()
    //"values" is being set with the event.target.value
    //and "values" is being returned so we can access it in our form
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }))
    console.log('this is values', values)
  }

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  }
}

export default useForm
