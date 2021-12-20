const https = require('https');
const fs = require('fs');

var authBitBucket = "Basic " + new Buffer('sangha-test-candidate2021' + ":" + 'SaSNNfUkuXLKhrxRMvuv').toString("base64");
var authAzure = "Basic " + new Buffer('sangha-test-candidate' + ":" + 'hkj87H8h^g$fh34').toString("base64");
var myStr;
var gitBranchData;

const optionsBranchJson = {
    headers: {
        "Authorization": authBitBucket,
        'Content-Type': 'application/json'
    },
    hostname: 'api.bitbucket.org',
    // port: 443,
    path: '/2.0/repositories/myquestcoteam/candidate-test-nodejs-2021/refs/branches/',
    method: 'GET'
}

const optionsFileDownloader = {
    headers: {
        "Authorization": authBitBucket,
    },
    hostname: 'bitbucket.org',
    // port: 443,
    //path: < Will be set later >
    method: 'GET'
}

const optionsAzurePoster = {
    headers: {
        "Authorization": authAzure,
    },
    hostname: 'sangha-test-candidate-nodejs2021.scm.azurewebsites.net',
    // port: 443,
    path: '/api/zipdeploy',
    method: 'POST'
}

const options = {
    method: "POST",
    headers: {
        "Authorization": authAzure,
        "Content-Type": "multipart/form-data"
    },
    formData : {
        "zip" : fs.createReadStream("branch-zayne_arnold.tar.gz")
    }
};

const req = https.request(optionsBranchJson, res => {

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
        optionsFileDownloader.path = '/myquestcoteam/candidate-test-nodejs-2021/get/' + branchHash + '.tar.gz';

        const file = fs.createWriteStream('branch-' + branchName + '.tar.gz');
        const request = https.get(optionsFileDownloader, function(response) {
          response.pipe(file);

        });


        // fs.createReadStream(branchName+'.tar.gz').pipe(request.put('http://localhost:8888/foo.xpi'));
        
    });

})



req.on('error', error => {
    console.error(error);
})

req.end()