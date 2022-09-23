const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post('/', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members :[
            {
                email_address : email,
                status: "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us13.api.mailchimp.com/3.0/lists/5aa4106e90";
    const options = {
        method : "POST",
        auth : "bhakti19:5aa84383a2f6ac9c18fdb321b5fc59cc-us13"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+ "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");  //in case of failure, go back to home route
});

const PORT = process.env.PORT || 3000; //random port that heroku dynamically defines for your app 
app.listen(PORT, function(){
    console.log("Ready on port 3000");
});

//Api key 5aa84383a2f6ac9c18fdb321b5fc59cc-us13
//audience/list id  5aa4106e90