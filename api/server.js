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

        if (args.appid && args.appsecret && args.url) {
            //            当请求数据中包含appid的时候才执行获取网页数据
            var _url = 'http://' + args.url;
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
                        var _signPackage = fn._getSignature(_tickets, _url, args.appid);

                        //使用兼容模式输出
//                        var _resStr = '<b>appId:</b>' + _signPackage.appid + '<br><b>timestamp:</b>' +_signPackage.timestamp + '<br><b>nonceStr:</b>' + _signPackage.nonceStr + '<br><b>signature:</b>' + _signPackage.signature;

                        response.end(JSON.stringify(_signPackage));
                    })
                });
            }
        }


        //响应内容
        response.writeHead(200, {
            "Content-Type": "application/json;charset=UTF-8; "
        });
    }

    http.createServer(onRequest).listen(8899);
    console.log('服务启动成功！');
}
exports.start = start;