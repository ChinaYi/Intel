/**
 * Created by chinayi on 2016/7/13.
 */

var request = require('request');
var mqtt = require('mqtt');


exports.mapserver = function(origin_x,origin_y,destination_x,destination_y,b_orientation, callback){
    //if(Math.sqrt(Math.pow(origin_x - destination_x, 2) + Math.pow(origin_y - destination_y, 2)) <= 0.0001)
    var url = 'http://restapi.amap.com/v3/direction/walking?origin='
        + origin_x+ ',' + origin_y + '&destination='
        + destination_x + ',' + destination_y
        + '&key=b05767911a19233d0dc975204f62ebad&output=JSON';
    request(url, function(err,response,body){
        var data =  JSON.parse(body);
        try{
            if(data.status == 1) {
                var m_orientation = changeOrientoDouble(data.route.paths[0].steps[0].orientation);
                callback(null ,b_orientation, m_orientation);
            }
        }catch(err){
            callback(err, null, null);
        }

    })
}

function makeJsonData(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
    data=JSON.stringify({"no1":arg1,"no2":arg2,"no3":arg3,"no4":arg4,"no5":arg5,"no6":arg6,"no7":arg7,"no8":arg8});
    return data;
}

function changeOrientoDouble(orientation){
    switch(orientation){
        case '北':
            return 90;
        case '西北':
            return 135;
        case '西':
            return 180;
        case '西南':
            return 225;
        case '南':
            return 270;
        case '东南':
            return 315;
        case '东':
            return 0;
        case '东北':
            return 45;
        default:
            return 0;
    }
}

exports.getResponse = function(b_orientation, m_orientation)
{
    var deviation;
    var jsonresponse;
    var temp = b_orientation - m_orientation;
    if (temp > 180) {
        deviation = temp - 360;
    }
    else if (temp < -180) {
        deviation = 360 + temp;
    }
    else {
        deviation = temp;
    }
    if (Math.abs(deviation) < 10) {
        //向前
        jsonresponse = makeJsonData(true, false, false, false, false, false, false, false);
    }
    else if (Math.abs(deviation) > 170) {
        //向后
        jsonresponse = makeJsonData(false, false, false, false, true, false, false, false);
    }
    else if (deviation > 0) {
        if (Math.abs(deviation - 90) < 10) {
            //console.log('右');
            jsonresponse = makeJsonData(false, false, false, false, false, false, true, false);
        }
        else if (deviation < 80) {
            //console.log('右前');
            jsonresponse = makeJsonData(true, false, false, false, false, false, true, true);
        }
        else if (deviation > 100 && deviation < 170) {
            //console.log('后右');
            jsonresponse = makeJsonData(false, false, false, false, true, true, true, false);
        }
    }
    else {
        if (Math.abs(deviation + 90) < 10) {
            //console.log('左');
            jsonresponse = makeJsonData(false, false, true, false, false, false, false, false);
        }
        else if (deviation + 80 > 0) {
            //console.log('左前');
            jsonresponse = makeJsonData(false, false, false, false, false, false, false, false);
        }
        else if (deviation + 80 < 0 && deviation + 170 > 0) {
            //console.log('后左');
            jsonresponse = makeJsonData(false, false, true, true, true, false, false, false);
        }
    }
    return jsonresponse;
}
