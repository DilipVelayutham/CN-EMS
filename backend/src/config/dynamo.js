const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;
