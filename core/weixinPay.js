//微信支付相关
var wxConfig = require('../config/weixin');
var util = require('./weixinUtil');
var request = require('request');
var md5 = require('MD5');
/*module.exports = {
	createUniOrder: function(openid,orderId,totalPrice,payInfo,ip,url) {
		ip = ip.match(/\d+.\d+.\d+.\d+/)[0];
		console.log('ip:'+ip)
		// 创建微信支付接口
		var wxpay = WXPay({
			appid: wxConfig.appid,
			mch_id: wxConfig.mch_id
		});

		return new Promise(function(resolve,reject){
			wxpay.getBrandWCPayRequestParams({
				openid: openid,
				body: payInfo,
			    detail: '公众号支付测试',
				out_trade_no: orderId,//内部订单号
				total_fee: totalPrice,
				spbill_create_ip: ip,
				notify_url: url
			}, function(err, result){
				if (err) {
					reject(err);
				}else{
			    	resolve(result);
				}
				// in express
			    // res.render('wxpay/jsapi', { payargs:result })
			});
		});
	}
};*/

function WXPay() {
	
	if (!(this instanceof WXPay)) {
		return new WXPay(arguments[0]);
	};

	this.options = arguments[0];
	this.wxpayID = { appid:wxConfig.appid, mch_id:wxConfig.mch_id };
};

WXPay.mix = function(){
	
	switch (arguments.length) {
		case 1:
			var obj = arguments[0];
			for (var key in obj) {
				if (WXPay.prototype.hasOwnProperty(key)) {
					throw new Error('Prototype method exist. method: '+ key);
				}
				WXPay.prototype[key] = obj[key];
			}
			break;
		case 2:
			var key = arguments[0].toString(), fn = arguments[1];
			if (WXPay.prototype.hasOwnProperty(key)) {
				throw new Error('Prototype method exist. method: '+ key);
			}
			WXPay.prototype[key] = fn;
			break;
	}
};


WXPay.mix('option', function(option){
	for( var k in option ) {
		this.options[k] = option[k];
	}
});

WXPay.mix('sign', function(param){
	var str = '';
	var arr = [];
	for(var name in param) {
		arr.push(name+'='+param[name]);
	}
	arr.sort();
	str = arr.join('&');			
	str = str+'&'+wxConfig.appSecret
	return md5(str).toUpperCase();
});

WXPay.mix('createWCPayOrder', function(order){
	order.ip = order.ip.match(/\d+.\d+.\d+.\d+/)[0];
	order.trade_type = "JSAPI";
	order.nonce_str = order.nonce_str || util.generateNonceString();
	util.mix(order, this.wxpayID);
	order.sign = this.sign(order);
	
	return new Promise((resolve,reject) => {
		this.requestUnifiedOrder(order,function(err,data){
			if (err) {
				reject(err);
			}else{
				resolve(JSON.parse(data));
			}
		},function(err){
			reject(err);
		});
	});
});

WXPay.mix('requestUnifiedOrder',function(order,fn,errFn){
	request({
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		method: 'POST',
		body: util.buildXML(order),
		agentOptions: {
			pfx: this.options.pfx,
			passphrase: this.options.mch_id
		}
	}, function(err, response, body){
		if (err) {
			errFn();
		}else{
			util.parseXML(body,fn);
		}
	});	
});

exports = module.exports = WXPay;

