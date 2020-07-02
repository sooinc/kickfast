import React from 'react'
import '../css/progressbar.css'

const ProgressBar = ({width, percent}) => {
  const [value, setValue] = React.useState(0)
  let half = 0.5 * width

  React.useEffect(() => {
    setValue(percent * width)
  })

  return (
    // <div className="progress-bar-marker" style={{width: `${half}px`}}>
    <div className="progress-bar" style={{width: width}}>
      <div className="progress" style={{width: `${value}px`}} />
    </div>
    // </div>
  )
}

export default ProgressBar
