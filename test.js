/**
 * Created by chinayi on 2016/7/13.
 */


//mosca is a common mqtt server
var mosca = require('mosca');

//HashMap is a map
var HashMap = require('hashmap');


var pool = require('./connectFactory').pool;
//mymap is responsible for send http request to Amap api,
//and analyse the response
var mymap = require('./mymap');


//Init mqttServer
var mqttServer = new mosca.Server({
    port : 1997
});

var period = 1000 * 30;
var c_password_target = new HashMap();
var c_clientID_password = new HashMap();
var password_historyID = new HashMap();

var interval = setInterval(getTargetInterval,period);

//refresh target for all connected clients in a period time
function getTargetInterval()
{
    if(c_password_target.count() >= 0)
    {
        for(var key in c_password_target){
            getTarget(c_password_target,key);
        }
    }
}

//refresh a client's target
function getTarget(c_password_target,password)
{
    pool.getConnection(function(err,connection){
        connection.query('select target_x, target_y from blindgo.blinduser where BID = ?',[password],function(err,rows){
            if(err) throw err;
            c_password_target.set(password, rows[0]);
            connection.release();
        })
    })
}

//insert record to history table
function startTrip(bid,s_x,s_y,start_time)
{
    if(start_time != null) {
        pool.getConnection(function (err, connection) {
            if (err) console.error(err);
            else {
                connection.query('insert into blindgo.history(bid,start_time,s_x,s_y) values(?,?,?,?) ',
                    [bid, start_time.Format("yyyy-MM-dd hh:mm:ss"), s_x, s_y], function (err) {
                        if (err) console.error(err);
                    });
                connection.release();
            }
        })
    }
}

//update the record in history table
function endTrip(bid,e_x,e_y,start_time)
{
    if(start_time != null)
        pool.getConnection(function(err,connection){
            if(err) console.error(err);
            else{
                connection.query('update blindgo.history set end_time = ?, e_x = ?, e_y = ? where bid = ? and `start_time` = ?',
                    [new Date(), e_x, e_y, bid, start_time.Format("yyyy-MM-dd hh:mm:ss")], function(err){
                        if(err) console.error(err);
                        else{
                            console.log(start_time.Format("yyyy-MM-dd hh:mm:ss"));
                        }
                    });
                connection.release();
            }
        })
}

function changeHelpStatus(bid, status)
{
    if(bid != null)
    {
        pool.getConnection(function(err, connection){
            if(err) console.error(err);
            else{
                connection.query('update blindgo.blinduser set isneedhelp = ? where bid = ?',
                    [status, bid],function(err){
                        if(err) console.error(err);
                    })
            }
            connection.release();
        })
    }
}
function changeCallStatus(bid, status){
    if(bid != null)
    {
        pool.getConnection(function(err, connection){
            if(err) console.error(err);
            else{
                connection.query('update blindgo.blinduser set isneedcalling = ? where bid = ?',
                    [status, bid], function(err){
                        if(err) console.error(err);
                    })
            }
            connection.release();
        })
    }
}
function changeWorkStatus(bid, status){
    if(bid != null)
    {
        pool.getConnection(function(err, connection){
            if(err) console.error(err);
            else{
                connection.query('update blindgo.blinduser set work = ? where bid = ?',
                    [status,bid], function(err){
                        if(err) console.error(err);
                    })
            }
            connection.release();
        })
    }
}
function checkAndCall(bid)
{
    if(bid != null)
    {
        pool.getConnection(function(err, connection){
            if(err) console.error(err);
            else{
                connection.query('select isneedhelp from blindgo.blinduser where bid = ?',
                    [bid], function(err, rows){
                        if(err) console.error(err);
                        else{
                            if(rows[0].isneedhelp == 1){
                                changeHelpStatus(bid,0);
                                changeCallStatus(bid,1);
                            }
                        }
                    })
            }
            connection.release();
        })
    }

}
//Useage : new Date().Format(fmt)
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//authenticate the clients, only the right password can pass the authorize
//the password is the insole'id
var authenticate = function(client,username,password,callback){
    pool.getConnection(function(err,connection){
        connection.query('select * from blindgo.blinduser where BID= ? ',[password.toString()], function(err,rows){
            if(err) throw err;
            if(rows.length == 0) callback(null,false);
            else {
                callback(null,true);
                //when a client pass the authenticate, we add it into the global array
                //and refresh it's detail in a period time
                c_clientID_password.set(client.id,password.toString());
                getTarget(c_password_target,password.toString());

                password_historyID.set(password.toString(),new Date());
                //means a client start his trip
                setTimeout(function(){
                    if(password != null)
                    {
                        pool.getConnection(function(err,connection){
                            if(err) console.error(err);
                            else{
                                connection.query('select current_x, current_y from blindgo.blinduser where bid = ?',[password],function(err,rows){
                                    if(err) console.error(err);
                                    else{
                                        startTrip(password.toString(), rows[0].current_x, rows[0].current_y, password_historyID.get(password.toString()));
                                        changeWorkStatus(password.toString(),1);
                                    }
                                })
                            }
                        })
                    }
                },5000);
            }
            connection.release();
        })
    })
}

//event clientConnected
mqttServer.on('clientConnected',function(client){
    console.log('client connected! ');
});

//event published, means a client publish a message
mqttServer.on('published',function(packet,client){
    var topic = packet.topic;
    //for different topic
    switch(topic){
        //work means normal request
        case 'work':
            try{
                var jsondata = JSON.parse(packet.payload.toString());
                //mymap server
                mymap.mapserver(jsondata.x,jsondata.y,(c_password_target.get(jsondata.bid)).target_x,
                    (c_password_target.get(jsondata.bid)).target_y,jsondata.orientation,
                    function(err, b_orientation, m_orientation)
                {
                    if(err) console.log(err);
                    else{
                        var jsonResponse = mymap.getResponse(b_orientation, m_orientation);
                        mqttServer.publish({
                            topic : jsondata.bid,
                            payload : jsonResponse.toString()
                        });
                    }
                });
                //update the database
                pool.getConnection(function(err,connection){
                    connection.query('UPDATE blindgo.blinduser set current_x = ?, current_y= ? where BID = ?',
                                            [jsondata.x,jsondata.y,jsondata.bid]
                        ,function(err){
                            if(err) console.log("work wrong!"+err);
                        });
                })
            }catch(err){
                console.log(err);
            }
        break;
        //emergency means client needs help
        case 'emergency':
            try{
                var jsondata = JSON.parse(packet.payload.toString());
                pool.getConnection(function (err, connection) {
                    connection.query('update blindgo.blinduser set isneedhelp = 1 where BID = ?',
                        [jsondata.bid],function(err){
                            if(err) console.log("emergency wrong!"+err);
                            else{
                                mqttServer.publish({topic : jsondata.bid, payload : "true"});
                                setTimeout(function(){
                                    //This segment of code should do that:
                                    //1. search table and find if isneedhelp = 1;
                                    //2. call phone.
                                    checkAndCall(jsondata.bid);
                                },5000)
                            }
                        });
                    connection.release();
                })
            }catch(err)
            {
                console.error(err);
            }

        break;
    }
})

//event ready, means mosca starts work
mqttServer.on('ready', function(){
    console.log('mqtt is running...');
    mqttServer.authenticate = authenticate;
});

//event clientDisconnected, means the client end up connection
//we need to remove the client detail from the global array, so that stop server it.
//also means a client end his trip
mqttServer.on('clientDisconnected',function(client){
    var password = c_clientID_password.get(client.id);
    var start_time = password_historyID.get(password);
    pool.getConnection(function(err,connection){
        if(err) console.error(err);
        else{
            connection.query('select current_x, current_y from blindgo.blinduser where bid = ?',[password],function(err,rows){
                if(err) console.error(err);
                else{
                    endTrip(password, rows[0].current_x, rows[0].current_y,start_time);
                    changeWorkStatus(password, 0);
                }
            });
            connection.release();
        }
    })
    c_clientID_password.remove(client.id);
    c_password_target.remove(password);
    password_historyID.remove(password);
});
