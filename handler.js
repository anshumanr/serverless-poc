'use strict';

var mysql = require('mysql');
var config = require('./config.json');

var AWS = require('aws-sdk');
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

var pool = mysql.createPool({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});

module.exports.createCC = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    pool.getConnection(function(err, connection) {
      if (err) {
        var response = {
          statusCode: 500,
          body: err
        };
      }
      var ccid = Math.floor(Math.random() * 100);
      var query = "create database cc" + ccid;
      // Use the connection
      connection.query(query, function (error, results, fields) {
          // And done with the connection.
          connection.release();
          // Handle error after the release.
          if (error) {
            response = {
              statusCode: 500,
              body: error
            };
            callback(response);
          }
          else {
              response = {
                statusCode: 200,
                body: JSON.stringify({'cc': ccid})
            };
            callback(null, response);
          }
      });
    });


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.createUserPool = (event, context, callback) => {
    // TODO implement
    let params = {
        PoolName: 'acc12', /* required */
        AdminCreateUserConfig: {
            AllowAdminCreateUserOnly: true,
            UnusedAccountValidityDays: 7
        },
        AliasAttributes: ['email'],
        AutoVerifiedAttributes: ['email'],
        DeviceConfiguration: {
            ChallengeRequiredOnNewDevice: false,
            DeviceOnlyRememberedOnUserPrompt: false
        },
        MfaConfiguration: 'OFF',
        Policies: {
            PasswordPolicy: {
                MinimumLength: 6,
                RequireLowercase: true,
                RequireNumbers: true,
                RequireSymbols: false,
                RequireUppercase: false
            }
        },
        Schema: [
            {
                AttributeDataType: 'String',
                DeveloperOnlyAttribute:false,
                Mutable: false,
                Name: 'email',
                Required: true
            },
            /* more items */
        ],
        UserPoolAddOns: {
            AdvancedSecurityMode: 'OFF' /* required */
        }
    };

    cognitoidentityserviceprovider.createUserPool(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
    //callback(null, 'Hello from Lambda');
};
