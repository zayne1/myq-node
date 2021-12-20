const https = require('https');
const fs = require('fs');

const userName = 'sangha-test-candidate2021';
const password = 'SaSNNfUkuXLKhrxRMvuv';
var auth = "Basic " + new Buffer(userName + ":" + password).toString("base64");
var myStr;
var gitBranchData;

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

const options2 = {
    headers: {
        "Authorization": auth,
    },
    hostname: 'bitbucket.org',
    // port: 443,
    //path: '/myquestcoteam/candidate-test-nodejs-2021/get/5f260e23e000ec62667e476b08add431a12623e8.tar.gz',
    method: 'GET'
}

const req = https.request(options, res => {

    // pump data into string asynchronously
    res.on('data', function (chunk) {
        myStr += chunk;
    });

    
    // once req is fully done (it's async), 
    res.on('end', function () {
        
        //show list of branch names
        
        var res = myStr.substring(myStr.indexOf('{'), myStr.length); // rm all chars before first occurunce of '{'
        var gitBranchData = JSON.parse(res).values;
        
        console.log('branch names and their hashes:');
        for(var i=0;i<gitBranchData.length;i++) {
            console.log(gitBranchData[i].name + ' ' + gitBranchData[i].target.hash);
        }

        // to get zip file, we could run (from terminal) : wget https://sangha-test-candidate2021:SaSNNfUkuXLKhrxRMvuv@bitbucket.org/myquestcoteam/candidate-test-nodejs-2021/get/5f260e23e000ec62667e476b08add431a12623e8.tar.gz
        // But we need to do this the node way, trying to use no 3rd party libs if possible

        var branchName = gitBranchData[gitBranchData.length - 1].name; // set to last json item
        var branchHash = gitBranchData[gitBranchData.length - 1].target.hash; // set to last json item
        options2.path = '/myquestcoteam/candidate-test-nodejs-2021/get/' + branchHash + '.tar.gz';

        const file = fs.createWriteStream('branch-' + branchName + '.tar.gz');
        const request = https.get(options2, function(response) {
        // const request = https.get("https://sangha-test-candidate2021:SaSNNfUkuXLKhrxRMvuv@bitbucket.org/myquestcoteam/candidate-test-nodejs-2021/get/5f260e23e000ec62667e476b08add431a12623e8.tar.gz", function(response) {
          response.pipe(file);
        });
    });

})

req.on('error', error => {
    console.error(error);
})

req.end()