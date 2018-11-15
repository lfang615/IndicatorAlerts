const api = require('binance');

class MovingAverage{
    constructor(pair){
        this.pair = pair;
        this.today = Math.round(new Date().getTime() / 1000);
        this.exchangeRest = new api.BinanceRest({
            key: 'nDvUlZPkI0S1adgfcR4eE7C5BB23lcFaLKV1LL7SYZxdhHYal0inX7NBwE4k7OKZ',
            secret: 'e5lCovFNHjMS98tRQCNPHtBUC6baCgSwOQMug7JyJQ8DaNBGElNln2woyfJoNAyO'
        });
        this.exchangeWS = new api.BinanceWS();
    }

     getEpoch(periodLength){
         let date = new Date();
         date.setDate(date.getDate() - periodLength);
         let date_UTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(),
                                 date.getUTCSeconds(), date.getUTCMilliseconds());
         return date_UTC;
    }

    getEpochToday() {
        let date = new Date();
        let date_UTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(),
            date.getUTCSeconds(), date.getUTCMilliseconds());
        return Math.round(date_UTC / 1000);
    }

    getClosingPrice(interval, periodLength) {
        let pricedata = 
            this.exchangeRest.klines({
                symbol: this.pair,
                interval: interval,
                limit: periodLength
            
                }).then((result) =>
                {
                    return result;
                });

        return pricedata;
    }

    getTestSMA(interval, periodLength) {

        let movingAverage = this.exchangeRest.klines({
            symbol: this.pair,
            interval: interval,
            limit: periodLength
        })
        .then((data) => {
            // Compute MA
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum += parseFloat(data[i]['close']);
            }

            return (sum / periodLength).toFixed(8);
        })
        .catch((err) => { console.log(err); });

        return movingAverage;
    }

    getSMA(interval, periodLength){
        
        let movingAverage = this.exchangeRest.klines({
            symbol: this.pair,
            interval: interval,
            startTime: this.getEpoch(periodLength)
        })
        .then((data) => {
            // Compute MA
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum += parseFloat(data[i]['close']);
            }

            return (sum / periodLength).toFixed(8);

        })
        .catch((err) => { console.log(err); });

        return movingAverage;
    }

    getEMA(interval, periodLength) {
        let yesterday = periodLength - 1;
        let movingAverage = this.exchangeRest.klines({
            symbol: this.pair,
            interval: interval,
            limit: periodLength
        })
        .then((data) => {
            // Compute EMA
            let sum = 0;
            let multiplier = 2 / (periodLength + 1);
            for (let i = 0; i < yesterday; i++) {
                sum += parseFloat(data[i]['close']);
            }

            let ema = parseFloat(sum / yesterday);
            let close = parseFloat(data[data.length - 1]['close']);
            let calc = ((close - ema) * multiplier + ema).toFixed(8);

            return calc;

        })
        .catch((err) => { console.log(err); });

        return movingAverage;
    }

    
}

module.exports = MovingAverage;