const api = require('binance');

class Volume{
    constructor(pair){
        this.pair = pair;
        this.exchangeRest = new api.BinanceRest({
            key: 'nDvUlZPkI0S1adgfcR4eE7C5BB23lcFaLKV1LL7SYZxdhHYal0inX7NBwE4k7OKZ', 
            secret: 'e5lCovFNHjMS98tRQCNPHtBUC6baCgSwOQMug7JyJQ8DaNBGElNln2woyfJoNAyO'
        })
    }

    getVolumeAvg(interval, periodLength){
        this.exchangeRest.klines({
            symbol: this.pair,
            interval: interval,
            limit: periodLength

        })
        .then((result) => {
            let sum = 0;
            for(let i = 0; i < result.length; i++){
                sum += parseFloat(result[i]['volume']);
            }
            console.log('Average volumne for the 20 day period: ' + 
            Math.round(sum / periodLength).toString());
        })
        .catch((err) => {
            console.log(err);
        });
    }

    getPrevClosePrice(interval){
        this.exchangeRest.klines({
            symbol: this.pair,
            interval: interval,
            limit: 2
        })
        .then((result) => {
            console.log('Previous closing price: ' + result[0]['close']);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    calcRSI(interval){
        this.exchangeRest.klines({
            symbol: this.pair,
            interval: interval, 
        })
        .then((result) => {
           console.log('This is the length of the RSI bitch: ' + result.length);
        }).catch((err) => {console.log(err);})
    }

    calcRSI_2(interval){
        this.exchangeRest.klines({
            symbol: this.pair,
            interval: interval,
            limit: 14
        })
        .then((result) => {
            let gain = 0;
            let loss = 0
            let prevGain = 0;
            let prevLoss = 0;

            for(let i = 0; i <= result.length-1; i++){
                for(let z = i+1; z <= result.length - 1; z++){
                    let change = this.closingPriceChange(parseFloat(result[i]['close']), parseFloat(result[z]['close'])); 
                    if(change >= 0){
                        gain += change;
                    }
                    if(change < 0){
                        loss += (-1 * change);
                    }
                   
                    break;
                }
            }
            
            let current = parseFloat(result[13]['close']) - parseFloat(result[12]['close']);
            let close = parseFloat(result[13]['close']);
            let alpha = 1 / 14;
            let smoothedRS = ((gain * 13) + ((current) >= 0 ? current : 0) / 14) / ((loss * 13) + ((current) < 0 ? (-1 * current) : 0) / 14); 
            let new_avg_value = close * alpha + (1 - alpha) * smoothedRS;
            let avgGain = gain / 14;
            let avgLoss = loss / 14;

            let anotherRSI = 100 - (100 / 1 + (avgGain * 13 + ((current) >= 0 ? current : 0)) / (avgLoss * 13 + ((current) < 0 ? (-1 * current) : 0)));
            
            let rs = avgGain / avgLoss;
            let rsi = 100 - (100 / (1 + rs));
    
            let newRSI = 100 - (100 / (1 + new_avg_value));
    
            console.log(newRSI);
        }).catch((err) => {console.log(err);})
    }


    rsiDebug(result){
        let gain = 0;
        let loss = 0
        let prevGain = 0;
        let prevLoss = 0;

        for(let i = 0; i < result.length; i++){
            for(let z = i+1; z <= result.length - 1; z++){
                let change = this.closingPriceChange(parseFloat(result[i]['close']), parseFloat(result[z]['close'])); 
                if(change >= 0){
                    gain += change;
                }
                if(change < 0){
                    loss += (-1 * change);
                }
               
                break;
            }
        }
        
        let current = parseFloat(result[13]['close']) - parseFloat(result[12]['close']);
        let close = parseFloat(result[13]['close']);
        let alpha = 1 / 14;
        let smoothedRS = ((gain * 13) + ((current) >= 0 ? current : 0) / 14) / ((loss * 13) + ((current) < 0 ? (-1 * current) : 0) / 14); 
        let new_avg_value = close * alpha + (1 - alpha) * smoothedRS;
        let avgGain = gain / 14;
        let avgLoss = loss / 14;
        
        let rs = avgGain / avgLoss;
        let rsi = 100 - (100 / (1 + rs));

        let newRSI = 100 - (100 / (1 + new_avg_value));

        console.log(newRSI);
    }

    closingPriceChange(prev, next){
        return next - prev;
    }
}

module.exports = Volume;