/**
 * Created by chinayi on 2016/7/26.
 */

var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost:1997',{
    username : 'username',
    password : 'qwer0001',
    keepalive : 10,
});

//client publish message, and subscribe result
client.on('connect',function(){
    console.log('connected...')
    var message = {
        "x" : 116.36,
        "y" : 39.63,
        "orientation": 45,
        "bid" : 'qwer0001'
    };
    client.publish('work',JSON.stringify(message));
    client.subscribe('qwer0001');
});

client.on('message',function(topic,message){
    console.log(message.toString());
})

client.on('error',function(){
    console.log("Do not connected...")
    client.end();
})
