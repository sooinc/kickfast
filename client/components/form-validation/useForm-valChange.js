import {useState, useEffect} from 'react'

const useForm = (validate, callback, compare = null) => {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [isSucceeded, setIsSucceeded] = useState(false)

  useEffect(() => {
    if (isSucceeded) {
      for (let key in values) {
        if (values.hasOwnProperty(key)) {
          values[key] = ''
        }
      }
      setValues(values)
    }
  }, [isSucceeded])

  //Listens to changes in values. if they are runs it thru validate to setError
  useEffect(() => {
    if (Object.keys(values).length > 0) {
      setErrors(validate(values, compare))
    }
  }, [values])

  //listens to any changes to error; if there are no keys in error object, set the button disable to false
  //NOTE: because error starts with 0 keys, we must also check to see if isEvaluating is set to true
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isEvaluating) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [errors])

  //we know the submit is able only if it passes validation so we can call callback here
  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    callback()

    setIsSucceeded(true)
  }

  const handleChange = (event) => {
    event.persist()
    //"values" is being set with the event.target.value
    //and "values" is being returned so we can access it in our form
    let name = event.target.name
    setValues((values) => ({
      ...values,
      [name]: event.target.value,
    }))
    setIsEvaluating(true)
    setIsSucceeded(false)
    console.log('this is values', values)
    console.log('this is errors', errors)
  }

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    isDisabled,
  }
}

export default useForm
