const https = require('https');
const userName = 'sangha-test-candidate2021';
const password = 'SaSNNfUkuXLKhrxRMvuv';
var auth = "Basic " + new Buffer(userName + ":" + password).toString("base64");

const options = {
    headers: {
        "Authorization": auth
    },
    hostname: 'api.bitbucket.org',
    // port: 443,
    path: '/2.0/repositories/myquestcoteam/candidate-test-nodejs-2021/refs/branches/',
    method: 'GET'
}

const req = https.request(options, res => {
    console.log('1111')
    console.log(`statusCode: ${res.statusCode}`)
        // console.log('calling 1' + res);

    res.on('data', d => {
        process.stdout.write(d)
            // console.log('calling 2' + d);
    })
})

req.on('error', error => {
    console.error(error)
})

req.end()