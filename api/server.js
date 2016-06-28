var http = require('http');
var https = require('https');
var url = require('url');
var fn = require('./fn');

function start() {
    function onRequest(request, response) {
        var _accessToken = "";
        var _tickets = "";
        //获取请求参数,在parse中加入true可以让请求参数变为object对象类型
        var args = url.parse(request.url, true).query;
        var _callback = args.callback?args.callback:'callback';
        if (args.appid && args.appsecret && args.url) {
            //            当请求数据中包含appid的时候才执行获取网页数据
            https.get(fn._getTokenOptions(args.appid, args.appsecret), function (res) {
                var _tokenStr = "";
                res.on('data', function (chunk) {
                    _tokenStr += chunk;
                })
                res.on("end", function () {
                    _accessToken = JSON.parse(_tokenStr).access_token;
                    getTicket(_accessToken);
                })
            })

            //获取ticket
            function getTicket(_token) {
                https.get(fn._getTicketOptions(_token), function (res) {
                    var _ticketStr = "";
                    res.on('data', function (chunk) {
                        _ticketStr += chunk;
                    })
                    res.on("end", function () {
                        _tickets = JSON.parse(_ticketStr).ticket;
                        var _signPackage = fn._getSignature(_accessToken,_tickets, args.url, args.appid);
                        
                        //如果需要使用json的方法获取数据，去掉callback即可
                        response.end(_callback + '(' + JSON.stringify(_signPackage) + ')');
                    })
                });
            }
        }


        //响应内容
        response.writeHead(200, {
            "Content-Type": "application/json;charset=UTF-8;",
            //解决跨域问题的代码，临时用不到，但是如果需要返回json数据的话会用到
//            "Access-Control-Allow-Origin" : "*",
//            "Access-Control-Allow-Headers" : "X-Requested-With",
//            "Access-Control-Allow-Methods" : "PUT,POST,GET,DELETE,OPTIONS"
        });
    }

    http.createServer(onRequest).listen(8889);
    console.log('服务启动成功！');
}
exports.start = start;