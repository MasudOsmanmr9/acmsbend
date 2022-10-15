const request = require('request')

class SMSManager {
    constructor() {

    }
    async sendSMS(receiver, msg) {

        var options = {
            method: 'POST',
            url: 'http://66.45.237.70/api.php',
            headers: {},
            formData: {
                number: receiver,
                message: msg,
                username: '',
                password: ''
            }
        };
        return new Promise(resolve => {
            request(options, function (error, response, body) {
                if (body && body.toString().includes('1101')) {
                    resolve({
                        Success: true,
                        Message: "SMS Sent"
                    });
                } else if (body && body.toString().includes('1000')) {
                    resolve({
                        Success: false,
                        Message: "Invalid user or Password"
                    });
                } else if (body && body.toString().includes('1002')) {
                    resolve({
                        Success: false,
                        Message: "Empty Number"
                    });
                } else if (body && body.toString().includes('1003')) {
                    resolve({
                        Success: false,
                        Message: "Invalid message or empty message"
                    });
                } else if (body && body.toString().includes('1004')) {
                    resolve({
                        Success: false,
                        Message: "Invalid number"
                    });
                } else if (body && body.toString().includes('1005')) {
                    resolve({
                        Success: false,
                        Message: "All Number is Invalid "
                    });
                } else if (body && body.toString().includes('1006')) {
                    resolve({
                        Success: false,
                        Message: "Insufficient SMS Balance "
                    });
                } else if (body && body.toString().includes('1009')) {
                    resolve({
                        Success: false,
                        Message: "Inactive Account"
                    });
                } else if (body && body.toString().includes('1010')) {
                    resolve({
                        Success: false,
                        Message: "Max number limit exceeded"
                    });
                }

                if (error) {
                    console.log("SMS MANAGER sendSMS: " + JSON.stringify(error));
                    resolve({
                        Success: false,
                        Message: JSON.stringify(error)
                    });
                }

            }, function (error, response, body) {
                if (error)
                    resolve(false);
            });

        })
    }

}

module.exports = SMSManager