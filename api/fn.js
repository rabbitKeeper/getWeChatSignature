var crypto = require('crypto');
module.exports = {
    _getRandomStr:function(){
        //返回16位随机字符
        var _aChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var _randomStr = "";
        for(var i = 0;i < 16;i++){
            _randomStr += _aChars.charAt(parseInt(Math.random()* _aChars.length));
        }
        return _randomStr;
    },
    _getTimeStamp : function(){
        //生成10位时间戳
        return Math.round(new Date().getTime()/1000);
    },
    _getTokenOptions : function(_appid,_secret){
        //获取连接option
        var path = '/cgi-bin/token?grant_type=client_credential&appid='+_appid+'&secret='+_secret;
        var  options = { 
            hostname:  "api.weixin.qq.com", 
            port: 443, 
            path:  path , 
            method:  'GET' , 
            rejectUnauthorized: false  
        }; 
        
        return options;
    },
    _getTicketOptions : function(token){
        var path = '/cgi-bin/ticket/getticket?type=jsapi&access_token='+token;
        var  options = { 
            hostname:  "api.weixin.qq.com", 
            port: 443, 
            path:  path , 
            method:  'GET' , 
            rejectUnauthorized: false  
        }; 
        
        return options;
    },
    _getSignature : function(jsapiTicket,url,appid){
        var sha1 = crypto.createHash('sha1');
        var _timeStamp = this._getTimeStamp();
        var _randomStr = this._getRandomStr();
        var _str = 'jsapi_ticket='+jsapiTicket+'&noncestr='+this._getRandomStr()+'&timestamp='+_timeStamp+'&url='+url;
        sha1.update(_str);
        var _signature = sha1.digest('hex');
        var _signPackage = {
            "appid" : appid,
            "timestamp" : _timeStamp,
            "nonceStr" : _randomStr,
            "signature" : _signature
        }
        
        return _signPackage;
    }
}