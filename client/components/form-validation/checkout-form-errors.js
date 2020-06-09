import React from 'react'

export const FormErrors = ({formErrors}) => (
  <div className="formErrors">
    {Object.keys(formErrors).map((fieldName) => {
      if (formErrors[fieldName] === ' ') return

      if (formErrors[fieldName].length > 0) {
        return (
          <p key={fieldName}>
            {fieldName} {formErrors[fieldName]}{' '}
          </p>
        )
      } else {
        return ''
      }
    })}
  </div>
)
