var time = require('time');

module.exports.roleTest = (event, context, callback) => {
    // TODO implement
    console.log(JSON.stringify(event));
    
    let currentTime = new time.Date();
    currentTime.setTimezone("America/New_York");
    
    let response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS 
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Access-Control-Allow-Origin"
        },
        body : 'CI/CD: ' + event.path + ' at ' + currentTime.toString(),
    };
    callback(null, response);
};
