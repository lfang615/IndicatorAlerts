const api = require('binance');
let MovingAverage = require('./ma_module.js');
let Volume = require('./volume_module');
const binanceWS = new api.BinanceWS(true);

  //const WebSocket = require('ws');
// const binanceRest = new api.BinanceRest({
//     key: 'nDvUlZPkI0S1adgfcR4eE7C5BB23lcFaLKV1LL7SYZxdhHYal0inX7NBwE4k7OKZ',
//     secret: 'e5lCovFNHjMS98tRQCNPHtBUC6baCgSwOQMug7JyJQ8DaNBGElNln2woyfJoNAyO'
// });

// Set to run on certain time of the day
// let ma20_BNB;
// let ma50_BNB;
// let ma100_BNB;

let ma_BNB = new MovingAverage('ETHBTC');

let vol_BNB = new Volume('ETHBTC');

vol_BNB.calcRSI_2('4h');
vol_BNB.getVolumeAvg('1d', 20);
vol_BNB.getPrevClosePrice('4h');

// ma_BNB.getClosingPrice('4h', 3).then((result) => { console.log(result); });

 ma_BNB.getEMA('4h', 100).then((result) => {
     console.log('100 period EMA: ' + result.toString());
 });

ma_BNB.getTestSMA('4h', 20).then((result) => {
     console.log('20 period (no calc) MA: ' + result.toString());
 });

// ma_BNB.getSMA('4h', 20).then((result) => {
//      console.log('20 period (self calculated) MA: ' + result.toString());
//  });

// binanceWS.onKline('BNBBTC', '4h', (data) => {
//   console.log(data);
// });

ma_BNB.getSMA('1d', 50).then((result) => {
   console.log('50 period MA: ' + result.toString());
});

ma_BNB.getSMA('1d', 100).then((result) => {
   console.log('100 period MA: ' + result.toString());
});



// Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
// if(!Date.now) Date.now = function() { return new Date(); }
// Date.time = function() { return Date.now().getUnixTime(); }


// ----------- 20 period MA's ----------------
let ma20_1day;
let ma20_4hr;
let ma20_1hr;
let ma20_30m;
// -------------------------------------------

// ----------- 50 period MA's ----------------
let ma50_1day;
let ma50_4hr;
let ma50_1hr;
let ma50_30m;
// -------------------------------------------



// var ws = new WebSocket('wss://www.bitmex.com/realtime');
// ws.on('open', function(){
//     ws.send('help');
// });

// ws.on('message', function(data){
//     console.log('Someshit is happening here.');
//     console.log(data);
// })


