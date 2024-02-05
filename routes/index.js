var express = require('express');
var router = express.Router();
const AWS = require("aws-sdk");

// Configure AWS SDK
AWS.config.update({
  region: "your-region", // e.g., us-west-2
  accessKeyId: "your-access-key-id",
  secretAccessKey: "your-secret-access-key"
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

router.get('/', async function(req, res, next) {
  // Example: Fetching all participants from a DynamoDB table
  const params = {
    TableName: "YourParticipantsTableName"
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error("Error fetching data from DynamoDB", error);
    res.status(500).send("Error fetching data");
  }
});

module.exports = router;
