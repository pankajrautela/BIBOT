// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');
var spellService = require('./spell-service');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Please drop us an email : BIBOT@Mercer.com about exact need. We will get back to you. Thanks.', session.message.text);
    
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('GreetingDialog', [
    function (session, args, next) {
        session.send('Hello, Welcome to Mercer BI ChatBot.<br/>I can answer your queries across (Premium Or Claims analysis) in Health domain and (Gender Diversity analysis) in Talent domain.', session.message.text);
    }
]).triggerAction({
    matches: 'Greeting'
});


//APAC Metrics
bot.dialog('APACMetricsDialog', [
    function (session, args, next) { 
        var DimensionEntity= builder.EntityRecognizer.findEntity(args.intent.entities, 'Dimensions');
        var APACBIMetricsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'APACBIMetrics');
        //console.log(regionEntity.entity +' '+premiumEntity.entity);
        if(APACBIMetricsEntity.entity =='premium'){
            //console.log(DimensionEntity.length);
                //session.send('Premium Data Analysis', session.message.text);
                console.log(DimensionEntity);
                if(DimensionEntity)
                {
                    //console.log('requested entity & value is:',DimensionEntity);
                    if(DimensionEntity.entity =='region'){
                        Store.PremiumResponse('Region')
                        .then(function (premiums) {
                        var aray = [];
                        premiums.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Premium Amount by Region. <br/>Total Aggregated Premium across '+premiums.length+' entites is $'+output[2]+' ,which averages to $'+output[3]+' <br/> The distribution ranges from $'+premiums[minIndex].Value+' ('+premiums[minIndex].Header+') to $'+premiums[maxIndex].Value+' ('+premiums[maxIndex].Header+'), a difference of $'+(premiums[maxIndex].Value-premiums[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                    }
                    else if(DimensionEntity.entity =='product'){
                        Store.PremiumResponse('Product')
                        .then(function (premiums) {
                        var aray = [];
                        premiums.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                   // console.log(aray);
                        var outline ='This analysis measures Premium Amount by Product Group. <br/>Total Aggregated Premium across '+premiums.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+'.<br/>The distribution ranges from $'+premiums[minIndex].Value+' ('+premiums[minIndex].Header+') to $'+premiums[maxIndex].Value+' ('+premiums[maxIndex].Header+'), a difference of $'+(premiums[maxIndex].Value-premiums[minIndex].Value);
                        session.send(outline,session.message.text);
                   });
                    }
                    else    if(DimensionEntity.entity =='subproduct'){
                        Store.PremiumResponse('SubProduct')
                        .then(function (premiums) {
                        var aray = [];
                        premiums.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Premium Amount by SubProduct. <br/>Total Aggregated Premium across '+premiums.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+' <br/> The distribution ranges from $'+premiums[minIndex].Value+' ('+premiums[minIndex].Header+') to $'+premiums[maxIndex].Value+' ('+premiums[maxIndex].Header+'), a difference of $'+(premiums[maxIndex].Value-premiums[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                    }
                    else if(DimensionEntity.entity =='client'){
                        //session.send('you are here', session.message.text);
                        //session.send('Here are some narrative findings against this analysis  <br/> [Premium By Client]', session.message.text);
                        Store.PremiumResponse('Client')
                        .then(function (premiums) {
                        var aray = [];
                        premiums.forEach(function(item){
                            console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);

                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                                    //console.log(output);
                        var outline ='This analysis measures Premium Amount by Client. <br/>Total Aggregated Premium across '+premiums.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+'.<br/>The distribution ranges from $'+premiums[minIndex].Value+' ('+premiums[minIndex].Header+') to $'+premiums[maxIndex].Value+' ('+premiums[maxIndex].Header+'), a difference of $'+(premiums[maxIndex].Value-premiums[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                        }
                }
                else
                {   
                    Store.PremiumResponse()
                    .then(function (premiums) {
                   // session.send('Aggregated Premium across Health is $'+premiums[0].Value, session.message.text);
                    session.beginDialog('askForPremiumDimension');
                   // var choices =[];
                    //builder.Prompts.choice(session, "Please select the desired project from below provided list?", projects, { listStyle: builder.ListStyle.button });
                   // session.endDialog();
                });
                }
            }
        else if(APACBIMetricsEntity.entity =='claims'){
               // session.send('claims Data Analysis', session.message.text);
                 if(DimensionEntity)
                        {
                        if(DimensionEntity.entity =='region'){
                        Store.ClaimsResponse('Region')
                        .then(function (claims) {
                        var aray = [];
                        claims.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = claims.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = claims.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Claims Amount by Region. <br/>Total Aggregated Premium across '+claims.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+' <br/> The distribution ranges from $'+claims[minIndex].Value+' ('+claims[minIndex].Header+') to $'+claims[maxIndex].Value+' ('+claims[maxIndex].Header+'), a difference of $'+(claims[maxIndex].Value-claims[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                    }
                   else    if(DimensionEntity.entity =='product'){
                            //session.send('Here are some narrative findings against this analysis  <br/> [Claims By Product]', session.message.text);
                            Store.ClaimsResponse('Product')
                        .then(function (claims) {
                        var aray = [];
                        claims.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        //console.log(maxMinAvg(aray));
                        var output = maxMinAvg(aray);
                                    var maxIndex = claims.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = claims.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Claims Amount by Product Class. <br/>Total Aggregated Premium across '+claims.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+' <br/> The distribution ranges from $'+claims[minIndex].Value+' ('+claims[minIndex].Header+') to $'+claims[maxIndex].Value+' ('+claims[maxIndex].Header+'), a difference of $'+(claims[maxIndex].Value-claims[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                    }
                     else    if(DimensionEntity.entity =='subproduct'){
                            //session.send('Here are some narrative findings against this analysis  <br/> [Claims By Product]', session.message.text);
                            Store.ClaimsResponse('SubProduct')
                        .then(function (claims) {
                        var aray = [];
                        claims.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = claims.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = claims.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Claims Amount by SubProduct. <br/>Total Aggregated Premium across '+claims.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+' <br/> The distribution ranges from $'+claims[minIndex].Value+' ('+claims[minIndex].Header+') to $'+claims[maxIndex].Value+' ('+claims[maxIndex].Header+'), a difference of $'+(claims[maxIndex].Value-claims[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                    }
                    else    if(DimensionEntity.entity =='client'){
                            //session.send('Here are some narrative findings against this analysis  <br/> [Claims By Client]', session.message.text);
                            Store.ClaimsResponse('Client')
                        .then(function (claims) {
                        var aray = [];
                        claims.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = claims.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = claims.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Claims Amount by Client. <br/>Total Aggregated Premium across '+claims.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+' <br/> The distribution ranges from $'+claims[minIndex].Value+' ('+claims[minIndex].Header+') to $'+claims[maxIndex].Value+' ('+claims[maxIndex].Header+'), a difference of $'+(claims[maxIndex].Value-claims[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                    }
                }
                else
                {   
                    session.beginDialog('askForClaimsDimension');
                }
        }
       // session.send('Health Data Analysis', session.message.text);
    },
    function (session, results) {
if(result.childid == '*:askForClaimsDimension'){
     session.send('claims by '+result.response.entity, session.message.text);
}
else if(result.childid == '*:askForPremiumDimension'){
session.send('Premium by '+result.response.entity, session.message.text);
}
console.log(results.childId);
    }

]).triggerAction({
    matches: 'HealthDataAnalysis'
});

bot.dialog('SuggestAPACDimensionsDialog', [
    function(session,result){
        var APACBIMetricsEntity= builder.EntityRecognizer.findEntity(result.intent.entities, 'APACBIMetrics');
        if(APACBIMetricsEntity.entity =='premium'){
        Store.PremiumResponse()
                    .then(function (premiums) {
                   // session.send('Aggregated Premium across Health is $'+premiums[0].Value, session.message.text);
                    session.beginDialog('askForPremiumDimension');
                    });
        }
        else if(APACBIMetricsEntity.entity =='claims'){
               Store.ClaimsResponse()
                    .then(function (premiums) {
                   // session.send('Aggregated Premium across Health is $'+premiums[0].Value, session.message.text);
                    session.beginDialog('askForClaimsDimension');
                    });
        }
    },
]).triggerAction({
    matches: 'SuggestAPACDimensions'
});

bot.dialog('askForPremiumDimension', [
    function (session) {
         Store.PremiumResponse()
                        .then(function (premiums) {
                        var aray = [];
                        premiums.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                   // console.log(aray);
                        var outline ='This analysis measures premium amount for APACBI China(Health). <br/>Total Aggregated Premium across this region is = $'+output[2];
                        
         builder.Prompts.choice(session, outline+"<br/>You perform further drill-down based on following attribute/dimension:", "Region|Client|Product|SubProduct", {listStyle: builder.ListStyle.button});
                        }); 
    },
    function (session, results) {
        //session.send('As per you  selection, I am fetching Premium insights, It may take a moment.', session.message.text);
        Store.PremiumResponse(results.response.entity)
                .then(function (premiums) {
                              var aray = [];
                        premiums.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = premiums.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Premium Amount by '+results.response.entity+'. <br/>Total Aggregated Premium across '+premiums.length+' entites is $'+output[2]+' ,which averages to $'+output[3]+' <br/> The distribution ranges from $'+premiums[minIndex].Value+' ('+premiums[minIndex].Header+') to $'+premiums[maxIndex].Value+' ('+premiums[maxIndex].Header+'), a difference of $'+(premiums[maxIndex].Value-premiums[minIndex].Value);
                        session.send(outline,session.message.text);
                });
                session.endDialogWithResult(results);
    }
]);
bot.dialog('askForClaimsDimension', [
    function (session) {
        Store.ClaimsResponse()
                        .then(function (claims) {
                        var aray = [];
                        claims.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = claims.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = claims.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                     var outline ='This analysis measures paid claims amount for APACBI China(Health). <br/>Total aggregated "Paid Claims" amount across this region is = $'+output[2];
                        
         builder.Prompts.choice(session, outline+"<br/>You perform further drill-down based on following attribute/dimension:", "Region|Client|Product|SubProduct", {listStyle: builder.ListStyle.button});
                        }); 
    },
    function (session, results) {
        //session.send('As per you  selection, I am fetching Premium insights, It may take a moment.', session.message.text);
        Store.ClaimsResponse(results.response.entity)
                .then(function (claims) {
                        var aray = [];
                        claims.forEach(function(item){
                            //console.log(item.Header+' '+item.Value);
                            aray.push(item.Value);
                        });
                        var output = maxMinAvg(aray);
                                    var maxIndex = claims.findIndex(function(val) {
                                      return val.Value == output[0]
                                    });
                                    var minIndex = claims.findIndex(function(val) {
                                      return val.Value == output[1]
                                    });
                                    console.log(aray);
                    
                        var outline ='This analysis measures Claims Amount by '+results.response.entity+'. <br/>Total Aggregated Premium across '+claims.length+' entites is $'+output[2]+' ,which averages to $'+(output[2]/aray.length)+' <br/> The distribution ranges from $'+claims[minIndex].Value+' ('+claims[minIndex].Header+') to $'+claims[maxIndex].Value+' ('+claims[maxIndex].Header+'), a difference of $'+(claims[maxIndex].Value-claims[minIndex].Value);
                        session.send(outline,session.message.text);
                        });
                session.endDialogWithResult(results);
    }
]);

// bot.dialog('askForClaimsDimension', [
//     function (session) {
//          builder.Prompts.choice(session, "You perform further drill down please choose desired attribute/dimension:", "Region|Client|Product|SubProduct", { listStyle: builder.ListStyle.button }); 
//     },
//     function (session, results) {
//         //session.send('As per you  selection, I am fetching claims insights, It may take a moment.', session.message.text);
//         Store.PremiumResponse(results.response.entity)
//                 .then(function (claims) {
//                     session.send('Aggregated Claims across APAC Health area is $'+claims[0].Value, session.message.text);
//                 });
//         session.endDialogWithResult(results);
//     }
// ]);

//Talent Metrics
bot.dialog('TalentMetricsDialog', [
    function (session, args, next) {
        session.send('Talent Data Analysis', session.message.text);
    }
]).triggerAction({
    matches: 'SurveyAnalysis'
});

//Browse all reports
bot.dialog('BrowseReportDialog', [
    function (session, args, next) {
        
        var Aggregation= builder.EntityRecognizer.findEntity(args.intent.entities, 'countReports');
        var APACBIMetricsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'APACBIMetrics');
console.log(Aggregation);
console.log(APACBIMetricsEntity);
        //console.log(regionEntity.entity +' '+premiumEntity.entity);
        if(Aggregation){
            if(APACBIMetricsEntity){
                        Store.ReportCountResponse(APACBIMetricsEntity.entity)
                        .then(function (dataset) {
                        var outline ='There are '+dataset[0].Value+' number of reports that have '+APACBIMetricsEntity.entity+' metrics.' 
                        builder.Prompts.choice(session, outline+"<br/>Please select the list which you are interested in?", "Report A|Report B|Report C", {listStyle: builder.ListStyle.button});
                  });
            }
             else
            {
            session.send('Here is list of reports that is presently live. You need to have access on associated projects to run these reports', session.message.text);
            }  
        }
        else
        {
        session.send('Here is list of reports that is presently live. You need to have access on associated projects to run these reports', session.message.text);
        }     
    }
]).triggerAction({
    matches: 'BrowseReports'
});

//Browse all projects
bot.dialog('BrowseProjectDialog', [
    function (session, args) {
        
 Store.searchProjects()
                .then(function (projects) {
                    // var choices =[];
                builder.Prompts.choice(session, "Please select the desired project from below provided list?", projects, { listStyle: builder.ListStyle.button });
                    
                   // session.endDialog();
                });
    },
    function (session, results) {
        session.dialogData.scope = results.response.entity;
          Store.searchReports(session.dialogData.scope)
                .then(function (reports) {
                builder.Prompts.choice(session, "Here is a list of reports in "+session.dialogData.scope+" project.", reports, { listStyle: builder.ListStyle.button });    
                session.endDialog();
                });

            // if(session.dialogData.scope == "APAC_CAD_Analytics(China)"){
            //     //session.beginDialog('askForHBProject');
            //     //    
            // }
            // else if(session.dialogData.scope == "Benefits Forecaster"){
            //     session.send('We have following reports in Enterprise Reporting', session.message.text);
            //     //session.beginDialog('askForERProject');
            // }
            // else if(session.dialogData.scope == "MMX US"){
            //     session.beginDialog('askForMMXProject');
            // }
            // else if(session.dialogData.scope == "Service Requests"){
            //     session.send('This option is in under developement');
            //     session.endDialog();
            // }
            
    },

]).triggerAction({
    matches: 'BrowseProjects'
});





//Authenticate
bot.dialog('AuthenticationDialog', [
    function (session, args, next) {
        session.send('Please provide your username and password.', session.message.text);
    }
]).triggerAction({
    matches: 'Authenticate'
});


//Run
bot.dialog('RunReportDialog', [
    function (session, args, next) {
        session.send('here is your data stats', session.message.text);
    }
]).triggerAction({
    matches: 'ExecuteReport'
});

function maxMinAvg(arr) {
    var max = arr[0];
    var min = arr[0];
    var sum = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
        if (arr[i] < min) {
            min = arr[i];
        }
        sum = sum + arr[i];
    }
    return [max, min, sum, sum/arr.length]; 
} 

