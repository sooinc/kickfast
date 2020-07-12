const AWS = require('aws-sdk')
AWS.config.update({
  region: 'us-east-2',
  // httpOptions: {xhrWithCredentials: false},
})

const ssm = new AWS.SSM()

module.exports = ssm
