'use strict'
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET'
});

module.exports.deleteUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `you are ${event.name}`,
      thing: event
    }, null, 2),
  };
};

module.exports.updateUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `you are ${event.name}`,
      thing: event
    }, null, 2),
  };
};

module.exports.getUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `you are ${event.name}`,
      thing: event
    }, null, 2),
  };
};

module.exports.createUser = async (event) => {
  try {
    console.log(event)
    let user = JSON.parse(event.body);
    if (JSON.parse(event.body).results && JSON.parse(event.body).results.length > 0) {
      user = JSON.parse(event.body).results[0];
    }

    await new Promise((resolve, reject) => {
      db.put({
        TableName: 'usersTable',
        Item: user
      }, (error) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        msg: 'User Created',
      })
    };
  }
  catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e
      })
    };
  }
};
