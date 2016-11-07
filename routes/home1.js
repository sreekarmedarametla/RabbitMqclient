/**
 * Created by Chaitu on 11/1/2016.
 */

var mq_client=require('../rpc/client');
var mongo=require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";


var winston=require('winston');
var logger1 = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'logs/logs.log' })
    ]
});


//with message queue

exports.checkSignin=function(req,res) {
    var name =  req.body.username;
    var password = req.body.password;

    var msg_payload={"name":name,"password":password};
    console.log("name is " + name);
    console.log("password is" + password);

    mq_client.make_request('login_queue',msg_payload, function(err,results){

        console.log(results);
        if(err)
        {
            console.log(err);
            throw err;
        }

        else
        {
            if(results.code==200)
             {
                 console.log("valid Login ");
                 req.session.username=name;
                 logger1.log('info',"user successfully validated and directed to homepage");
                 res.send({"statusCode":200});
             }
            else {
                   console.log("Invalid Login");
                   res.send({"statusCode":401});
                 }

        }


    })
}


//adding new user with message queues

exports.newUserSignup=function(req,res)
{
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    var password=req.body.password;
    var json_response;
    if(firstname&&lastname&&email&&password)
    {
        var pattern=/^[a-zA-Z0-9!@#$%^&*\/]{6,}$/;
        if(password.match(pattern))
        {

            var msg_payload={"firstname":firstname,"lastname":lastname,"email":email,"password":password};

            mq_client.make_request('signup_queue',msg_payload, function(err,results) {
                if (err) {
                           console.log(err);
                           throw err;
                         }
                else
                {
                    json_response ={"data":"user successfully added"};
                    logger1.log('info',"user successfully validated and registered to database");
                    res.send(json_response);
                }

            })
        }
                else {
                       json_response = {"data": "password should be atleast 6 characters"};
                       res.send(json_response);
                     }
        }
        else
        {
            json_response={"data":"please enter all the fields"};
            res.send(json_response);
        }

    };

//loading homepage with message queues

exports.loadHomePage=function(req,res)
{
    var msg_payload={};
    mq_client.make_request('homepage_Queue',msg_payload,function(err,results){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("success");
            logger1.log('info',"user visited homepage");
            res.send(results);
        }
    })

}


//user bid

function postUserBid(req,res){
    // inserting bid values into database
    var d = new Date();

    var curr_date = d.getDate();

    var curr_month = d.getMonth();

    var curr_year = d.getFullYear();

    var date=curr_year + "-" + curr_month + "-" +curr_date+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    console.log(date);
    var msg_payload= {
        userid: req.session.userid,
        productid: req.body.productid,
        userbidprice: req.body.userbidprice,
        date:date
    }
    mq_client.make_request('bid_Queue',msg_payload,function(err,results){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("success");
            logger1.log('info',"successfully bidded for product");
            res.send(results);
        }
    })


}


//posting adds into products database

function postAdd(req,res){
    var msg_payload={
        productname:req.body.productname,
        productdescription:req.body.productdescription,
        sellerinformation:req.body.sellerinformation,
        productprice:req.body.productprice,
        quantity:req.body.quantity,
        selleremail:req.body.selleremail
    }

    logger1.log('info',"Posting add");
}




function postOrder(req,res){

    console.log(req.body);
    console.log(req.session.userid);
    var d = new Date();

    var curr_date = d.getDate();

    var curr_month = d.getMonth();

    var curr_year = d.getFullYear();

    var date=curr_year + "-" + curr_month + "-" +curr_date;
    var post={
        orderdate:date,
        productid:req.body.productid,
        productdescription:req.body.productdescription,
        orderedquantity: req.body.quantity,
        useremail: req.session.userid
    }

    var postOrderquery='INSERT INTO orders set?'
    mysql.insertOrder(postOrderquery,post);
    logger1.log('info',"user is ordering the product");
}



function getOrders(req,res){
    var email=req.session.userid;
    var fetchOrdersQuery="select * from orders where useremail='"+email+"'";
    mysql.fetchOrderData(function(err,results){
        if(err)
        {
            console.log(error);
        }
        else
        {
            console.log(JSON.stringify(results));
            res.send(results);

        }
    },fetchOrdersQuery);
    logger1.log('info',"user order history");

}

function getsoldProducts(req,res){
    var email=req.session.userid;
    var fetchsoldProductsquery="select * from products where selleremail='"+email+"'";
    mysql.fetchSoldProducts(function(err,result) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);
            res.send(result);
        }

    },fetchsoldProductsquery);
    logger1.log('info',"User Selling Products");
}



exports.getsoldProducts=getsoldProducts;
exports.getOrders=getOrders;
exports.postOrder=postOrder;
exports.postAdd=postAdd;
exports.postUserBid=postUserBid;


