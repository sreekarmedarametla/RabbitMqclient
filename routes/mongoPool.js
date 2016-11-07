/**
 * Created by Chaitu on 10/29/2016.
 */
var MongoClient=require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ebay";


var optionvalues = {
    db:{
        numberOfRetries : 5
    },
    server: {
        auto_reconnect: true,
        poolSize : 200,
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    replSet: {},
    mongos: {}
};

function  MongoPool() {}

var dbconn;

function initiatePool(callback){
MongoClient.connect(url,optionvalues,function (err,db) {
    if(err)
    {
        throw new Error('Could not connect: '+err);
    }

    dbconn=db;
    connected=true;
    if(callback && typeof(callback) == 'function')
        callback(dbconn);
   });
    return MongoPool;
}

MongoPool.initiatePool = initiatePool;

function connect(url,callback)
{
    if(!dbconn)
    {
      initiatePool(callback);
    }
    else
    {
        if(callback && typeof(callback) == 'function')
            callback(dbconn);

    }
}

MongoPool.connect = connect;
module.exports = MongoPool;

