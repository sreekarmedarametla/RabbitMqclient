/**
 * Created by Chaitu on 10/29/2016.
 */

var mongoPool=require('./mongoPool');
var mongoURL = "mongodb://localhost:27017/ebay";
/*
exports.checkSignin=function(req,res){
  var name=req.body.username;
    var password=req.body.password;
    console.log("name is "+name);
    console.log("password is"+password);
    mongo.connect(mongoURL,function () {
    console.log("connected to mongo at " + mongoURL);
    var collect = mongo.collection('users');
    collect.findOne({name: name, password: password}, function (err, user) {
        if (user) {
            req.session.username = user.name;
            console.log(req.session.username + " is the session");
            json_responses = {"statusCode": 200};
            res.send(json_responses);

        } else {
            console.log("returned false");
            json_responses = {"statusCode": 401};
            res.send(json_responses);
        }

    });
});
};
*/


// with connection pooling

exports.checkSignin=function(req,res) {
    var name = req.body.username;
    var password = req.body.password;
    console.log("name is " + name);
    console.log("password is" + password);

    mongoPool.connect(mongoURL,function(db) {
        console.log("connected to mongo at " + mongoURL);
        var collect = db.collection('users');

        collect.findOne({name: name, password: password}, function (err, user) {
            if (user) {
                req.session.username = user.name;
                console.log(req.session.username + " is the session");
                json_responses = {"statusCode": 200};
                res.send(json_responses);

            } else {
                console.log("returned false");
                json_responses = {"statusCode": 401};
                res.send(json_responses);
            }

        });
    })
}



