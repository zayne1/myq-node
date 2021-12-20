const https = require('https');

const userName = 'sangha-test-candidate2021';
const password = 'SaSNNfUkuXLKhrxRMvuv';
var auth = "Basic " + new Buffer(userName + ":" + password).toString("base64");
var myStr;

const options = {
    headers: {
        "Authorization": auth,
        'Content-Type': 'application/json'
    },
    hostname: 'api.bitbucket.org',
    // port: 443,
    path: '/2.0/repositories/myquestcoteam/candidate-test-nodejs-2021/refs/branches/',
    method: 'GET'
}

const req = https.request(options, res => {

    // pump data into string asynchronously
    res.on('data', function (chunk) {
        myStr += chunk;
    });

    
    // once req is fully done (it's async), show list of branch names
    res.on('end', function () {
        
        var res = myStr.substring(myStr.indexOf('{'), myStr.length); // rm all chars before first occurunce of '{'
        var values = JSON.parse(res).values;
        
        console.log('branch names and their hashes:');
        for(var i=0;i<values.length;i++) {
            console.log(values[i].name + ' ' + values[i].target.hash);
        }
    });

})

req.on('error', error => {
    console.error(error);
})

req.end()