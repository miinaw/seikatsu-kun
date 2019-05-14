const AWS = require('aws-sdk');
class DynamoClient {
  constructor() {
    this.client = new AWS.DynamoDB.DocumentClient();
  }
  
  put(params) {
    this.client.put(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        return data;
      }
    })
  }
  
  get(params) {
    this.client.get(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(data);
      }
    })
  }
  
  delete(params) {
    this.client.delete(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(data);
      }
    })
  }
}
module.exports.DynamoClient = DynamoClient;