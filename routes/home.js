/**
 * Created by Chaitu on 10/30/2016.
 */
var mongoPool=require('./mongoPool');
var mongoURL = "mongodb://localhost:27017/ebay";


exports.redirectHomepage=function(req,res){
    if(req.session.username) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('index');
    }
    else{

        res.redirect('/');
    }
}

exports.logoutUser=function(req,res){
    console.log("destroying session");
    req.session.destroy();
    res.send("logout successfull");
}




exports.fetchHomepageData=function(req,res)
{
    mongoPool.connect(mongoURL,function(db){
        console.log("connected to mongo at " + mongoURL);
        var collect = db.collection('inventory');
        collect.find({}).toArray(function (err,results) {
            console.log("got it from database");
            res.send(results);
            console.log(results);
        });

        });
}