var Promise = require('bluebird');
var http = require('http');
// Get ProjectList
function getProjectList(){
    return new Promise(function(resolve, reject) {
        var projects = [];
        var extServerOptions = {
        host: 'aumel13as26v',
        port:80,
        headers: {
            'Content-Type': 'application/json'
        },
        path: '/MicrostrategyBOT/metadata/GetProjectList?ProjectKey=0',
        method: 'GET'
        };
        var responseString='';
        http.request(extServerOptions, function (res) {
        console.log("response statusCode: ", res.statusCode);
        res.on('data', function(data) {
        responseString += data;
        });
        res.on('end', function() {
        var responseObject = JSON.parse(responseString);
        responseObject.forEach(function(val){
        projects.push(val.IS_PROJ_NAME);
        });
        resolve(projects);
        });
    }).end();
  });
}
//Get ReportList
function getReportList(projectName){
    return new Promise(function(resolve, reject) {
        var reports = [];
        var extServerOptions = {
        host: 'aumel13as26v',
        port:80,
        headers: {
            'Content-Type': 'application/json'
        },
        path: '/MicrostrategyBOT/metadata/GetReportList?ProjectName='+projectName,
        method: 'GET'
        };
        var responseString='';
        http.request(extServerOptions, function (res) {
            res.on('data', function(data) {
            responseString += data;
        });
        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            responseObject.forEach(function(val){
            reports.push(val.IS_DOC_NAME);
            });
            resolve(reports);
            });
        }).end();
    });
}

//Get Premium Analytics for single dimension
function getPremiumAnalytics(Dimensions){
    console.log('Received dimension ='+Dimensions);
    return new Promise(function(resolve, reject) {
        var output = []; 
        var extServerOptions = {
        host: 'aumel13as26v',
        port:80,
        headers: {
            'Content-Type': 'application/json'  
        },
        //below path yet to be created as web API, it takes one dimension as argument
        path: '/MicrostrategyBOT/Warehouse/GetPremiumByDimension?Dimension='+Dimensions,
        method: 'GET'
        };
        var responseString='';
        http.request(extServerOptions, function (res) {
            res.on('data', function(data) {
            responseString += data;
        });
        
        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            responseObject.forEach(function(val){
            output.push({'Header':val.Header,
            'Value':parseInt(val.Value)}); //'AggregatedPremium'' will be replaced by metric name returned by query
            });
            resolve(output);
            });
        }).end();
    });
}

//Get Claims Analytics for single dimension
function getClaimsAnalytics(Dimensions){
    return new Promise(function(resolve, reject) {
        var output = []; 
        var extServerOptions = {
        host: 'aumel13as26v',
        port:80,
        headers: {
            'Content-Type': 'application/json'
        },
        //below path yet to be created as web API, it takes one dimension as argument
        path: '/MicrostrategyBOT/Warehouse/GetClaimsByDimension?Dimension='+Dimensions,
        method: 'GET'
        };
        var responseString='';
        http.request(extServerOptions, function (res) {
            res.on('data', function(data) {
            responseString += data;
        });
        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            responseObject.forEach(function(val){
            output.push({'Header':val.Header,
            'Value':parseInt(val.Value)}); 
            //reports.push(val.AggregatedClaims); //'AggregatedClaims'' will be replaced by metric name returned by query
            });
            resolve(output);
            });
        }).end();
    });
}
function getReportCount(countType){
    return new Promise(function(resolve, reject) {
        var output = []; 
        var extServerOptions = {
        host: 'aumel13as26v',
        port:80,
        headers: {
            'Content-Type': 'application/json'
        },
        //below path yet to be created as web API, it takes one dimension as argument
        path: '/MicrostrategyBOT/metadata/GetReportCount?CountType='+countType,
        method: 'GET'
        };
        var responseString='';
        http.request(extServerOptions, function (res) {
            res.on('data', function(data) {
            responseString += data;
        });
        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            output.push({'Header':responseObject.Head,
            'Value':parseInt(responseObject.Count)}); 
            resolve(output);
            });
        }).end();
    });
}
module.exports = {
    searchProjects:function(){
    return new Promise(function (resolve) {
    var projectlist = getProjectList();
             setTimeout(function () { resolve(projectlist); }, 1000);
         });
    },
    searchReports:function(projectName){
    return new Promise(function (resolve) {
    var reportlist = getReportList(projectName);
             setTimeout(function () { resolve(reportlist); }, 1000);
         });
    },
    PremiumResponse:function(Dimensions){
    return new Promise(function (resolve) {
    var PremiumOutput = getPremiumAnalytics(Dimensions);
             setTimeout(function () { resolve(PremiumOutput); }, 1000);
         });
    },
    ClaimsResponse:function(Dimensions){
    return new Promise(function (resolve) {
    var ClaimsOutput = getClaimsAnalytics(Dimensions);
             setTimeout(function () { resolve(ClaimsOutput); }, 1000);
         });
    },
    ReportCountResponse:function(countType){
    return new Promise(function (resolve) {
    var reportCount = getReportCount(countType);
             setTimeout(function () { resolve(reportCount); }, 1000);
         });
    }
};
 /*Reference Example - Not part of BI CHATBOT start
    searchHotels: function (destination) {
        return new Promise(function (resolve) {

            // Filling the hotels results manually just for demo purposes
            var hotels = [];
            for (var i = 1; i <= 5; i++) {
                hotels.push({
                    name: destination + ' Hotel ' + i,
                    location: destination,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'https://placeholdit.imgix.net/~text?txtsize=35&txt=Hotel+' + i + '&w=500&h=260'
                });
            }

            hotels.sort(function (a, b) { return a.priceStarting - b.priceStarting; });

            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(hotels); }, 1000);
        });
    },

    searchHotelReviews: function (hotelName) {
        return new Promise(function (resolve) {

            // Filling the review results manually just for demo purposes
            var reviews = [];
            for (var i = 0; i < 5; i++) {
                reviews.push({
                    title: ReviewsOptions[Math.floor(Math.random() * ReviewsOptions.length)],
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris odio magna, sodales vel ligula sit amet, vulputate vehicula velit. Nulla quis consectetur neque, sed commodo metus.',
                    image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif'
                });
            }

            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(reviews); }, 1000);
        });
    }
    //Reference Example - Not part of BI CHATBOT END
*/

