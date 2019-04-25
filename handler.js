'use strict'
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET'
});

module.exports.deleteUser = async (event) => {
  try {
    await new Promise((resolve, reject) => {
      db.delete({
        TableName: 'usersTable',
        Key: {
          email: event.queryStringParameters['email']
        }
      }, (error) => {
        if (error === null) {
          resolve();
        } else {
          reject(error);
        }
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User deleted"
      }, null, 2),
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: e
      }, null, 2),
    };
  };
};

module.exports.updateUser = async (event) => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: 'usersTable',
    Key: {
      email: body.email,
    },
    ExpressionAttributeNames: {
      '#real_name': 'name',
    },
    ExpressionAttributeValues: {
      ':new_name': body.newName,
    },
    UpdateExpression: 'SET #real_name = :new_name',
    ReturnValues: 'ALL_NEW',
  };

  try {
    const updatedUser = await new Promise((resolve, reject) => {
      db.update(params, (err, result) => {
        if (err === null) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: updatedUser
      }, null, 2),
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        err: e
      }, null, 2),
    };
  }
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
