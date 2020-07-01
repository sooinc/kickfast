/* eslint-disable react/jsx-key */
import React from 'react'
import {connect} from 'react-redux'
import {addingIp, removingIp} from '../store/user'

import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import TextField from '@material-ui/core/TextField'
import {IconButton, Button} from '@material-ui/core'

class IpList extends React.Component {
  constructor() {
    super()
    this.state = {
      newIp: '',
      newIpDisable: true,
      formErrors: {
        ipAddress: ' ',
      },
    }
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({[name]: value}, () => {
      this.validateField(value)
    })
  }

  validateField = (value) => {
    let fieldValidateErrors = this.state.formErrors
    let newIp = this.state.newIp
    let currentIp = this.props.ipAddress || []

    newIp = value.match(
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
    )

    if (currentIp.length >= 3) {
      fieldValidateErrors.ipAddress = '3 is max. Not able to add more.'
      this.setState({newIpDisable: true})
      this.setState({newIp: ''})
    } else if (newIp) {
      fieldValidateErrors.ipAddress = ''
      this.setState({newIpDisable: false})
    } else if (!newIp) {
      fieldValidateErrors.ipAddress = 'I.P. address is invalid.'
      this.setState({newIpDisable: true})
    } else {
      this.setState({newIpDisable: false})
    }

    this.setState({formErrors: fieldValidateErrors}, () => {
      this.props.validateForm()
    })
  }

  handleAdd = async (event) => {
    event.preventDefault()
    await this.props.addingIp(this.state.newIp)
    this.props.validateForm()
    this.setState({formErrors: {ipAddress: ' '}})
    this.setState({newIp: ''})
  }

  handleDelete = async (event, ip) => {
    event.preventDefault()
    console.log(ip)
    await this.props.removingIp(ip)
    this.props.validateForm()
    this.setState({formErrors: {ipAddress: ' '}})
  }

  render() {
    let {ipAddress} = this.props
    let ipAddresses = ipAddress ? ipAddress : []
    let {newIp, newIpDisable, formErrors} = this.state
    return (
      <div className="edit-ip-container">
        <div className="edit-ip-input">
          <TextField
            id="outlined-size-normal"
            variant="outlined"
            margin="normal"
            label="I.P. Address"
            helperText="Add up to 3."
            name="newIp"
            type="text"
            value={newIp}
            onChange={this.handleChange}
          />
          <div className="edit-ip-input-btn">
            <Button
              fullWidth
              variant="outlined"
              size="large"
              type="submit"
              id="addNewIp"
              onClick={this.handleAdd}
              disabled={newIpDisable}
            >
              Add
            </Button>
          </div>

          <div className="edit-ip-list">
            {ipAddresses.map((ip) => {
              return (
                <div key={ip}>
                  <IconButton onClick={(event) => this.handleDelete(event, ip)}>
                    <DeleteRoundedIcon />
                  </IconButton>
                  {ip}
                </div>
              )
            })}
          </div>
        </div>
        {formErrors.ipAddress && (
          <p className="error-message1">{formErrors.ipAddress}</p>
        )}
      </div>
    )
  }
}

const dispatchToProps = (dispatch) => ({
  addingIp: (ip) => dispatch(addingIp(ip)),
  removingIp: (ip) => dispatch(removingIp(ip)),
})

const ConnectedIpList = connect(null, dispatchToProps)(IpList)

export default ConnectedIpList
